// ============================================================================
// API HTTP do Origem.
//
// Rotas:
//   GET  /saude              — o banco está de pé? (usado pelos scripts de teste)
//   GET  /produtos/:id       — consulta um produto (para ler o estoque atual)
//   POST /pedidos            — checkout SEGURO (ou o ingênuo, se NAIVE_CHECKOUT=true)
//   POST /pedidos-naive      — checkout INGÊNUO sempre, para o teste comparativo
//   POST /produtos/:id/imagens — [Etapa 2] registra a imagem e ENFILEIRA o
//                                processamento; responde 202 na hora
//   GET  /fila               — [Etapa 2] estado da fila por status + dead-letter
//   POST /teste/reiniciar    — zera pedidos, fila e estoque (auxiliar de teste)
//   POST /teste/fila         — [Etapa 2] enfileira N jobs de uma vez (teste de carga)
//
// Subir:  npm run api    (e, em outro terminal, npm run worker)
// ============================================================================

import express from "express";
import { pool, comTransacao } from "./db.js";
import { criarPedidoSeguro } from "./checkout-seguro.js";
import { criarPedidoIngenuo } from "./checkout-ingenuo.js";
import { EstoqueInsuficiente, ProdutoInexistente } from "./pedido.js";
import { enfileirar, resumo } from "./fila.js";

const PORTA = Number(process.env.PORT ?? 3333);

// Flag de ambiente pedida pelo enunciado: permite rodar a API inteira no modo
// ingênuo sem trocar de rota.
const NAIVE_CHECKOUT = process.env.NAIVE_CHECKOUT === "true";

const app = express();
app.use(express.json());

// ----------------------------------------------------------------------------
// Validação do corpo da requisição.
// Rejeitar entrada malformada com 400 evita que erros de digitação do teste
// apareçam depois como falhas misteriosas de concorrência.
// ----------------------------------------------------------------------------
function validarPedido(corpo) {
  if (!corpo || typeof corpo !== "object") return "Corpo da requisição ausente.";
  if (!Number.isInteger(corpo.compradorId)) return "compradorId deve ser um inteiro.";
  if (typeof corpo.enderecoEntrega !== "string" || corpo.enderecoEntrega.trim() === "") {
    return "enderecoEntrega é obrigatório.";
  }
  if (!Array.isArray(corpo.itens) || corpo.itens.length === 0) {
    return "itens deve ser uma lista com ao menos um item.";
  }
  for (const item of corpo.itens) {
    if (!Number.isInteger(item?.produtoId)) return "Cada item precisa de produtoId inteiro.";
    if (!Number.isInteger(item?.quantidade) || item.quantidade < 1) {
      return "Cada item precisa de quantidade inteira >= 1.";
    }
  }
  return null;
}

/**
 * Traduz os erros do domínio e do PostgreSQL em códigos HTTP.
 *
 * Os dois códigos de erro do Postgres que aparecem aqui são importantes para a
 * evidência do trabalho:
 *
 *   23514 — check_violation: alguém tentou gravar estoque negativo e a
 *           constraint CHECK (estoque >= 0) barrou. Se isso aparecer no log,
 *           significa que o código de aplicação deixou passar e a rede de
 *           proteção do banco entrou em ação. É esperado na versão ingênua;
 *           na versão segura, seria sinal de bug.
 *
 *   40P01 — deadlock_detected: o Postgres encontrou duas transações esperando
 *           uma pela outra e matou uma delas. Se isso aparecer na versão
 *           segura, a ordenação por produto_id falhou em algum caminho.
 */
function responderErro(res, erro) {
  if (erro instanceof EstoqueInsuficiente) {
    return res.status(409).json({
      erro: "ESTOQUE_INSUFICIENTE",
      mensagem: erro.message,
      produtoId: erro.produtoId,
    });
  }
  if (erro instanceof ProdutoInexistente) {
    return res.status(404).json({
      erro: "PRODUTO_INEXISTENTE",
      mensagem: erro.message,
      produtoId: erro.produtoId,
    });
  }
  if (erro?.code === "23514") {
    console.error("[ALERTA] constraint CHECK barrou estoque negativo:", erro.message);
    return res.status(500).json({
      erro: "VIOLACAO_CHECK_ESTOQUE",
      mensagem: "O banco impediu um estoque negativo (constraint CHECK).",
    });
  }
  if (erro?.code === "40P01") {
    console.error("[ALERTA] deadlock detectado pelo PostgreSQL:", erro.message);
    return res.status(409).json({
      erro: "DEADLOCK_DETECTADO",
      mensagem: "Transação abortada pelo banco por impasse de locks.",
    });
  }
  console.error("[ERRO INESPERADO]", erro);
  return res.status(500).json({ erro: "ERRO_INTERNO", mensagem: String(erro?.message ?? erro) });
}

// ----------------------------------------------------------------------------
// Rotas
// ----------------------------------------------------------------------------

app.get("/saude", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, checkoutPadrao: NAIVE_CHECKOUT ? "ingenuo" : "seguro" });
  } catch (erro) {
    res.status(503).json({ ok: false, mensagem: String(erro?.message ?? erro) });
  }
});

app.get("/produtos/:id", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nome, preco, estoque, status FROM produto WHERE id = $1`,
      [Number(req.params.id)],
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "PRODUTO_INEXISTENTE" });
    }
    const p = resultado.rows[0];
    res.json({
      id: Number(p.id),
      nome: p.nome,
      preco: Number(p.preco),
      estoque: p.estoque,
      status: p.status,
    });
  } catch (erro) {
    responderErro(res, erro);
  }
});

/** Checkout padrão: seguro, salvo se NAIVE_CHECKOUT=true no ambiente. */
app.post("/pedidos", async (req, res) => {
  const problema = validarPedido(req.body);
  if (problema) return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: problema });

  const criar = NAIVE_CHECKOUT ? criarPedidoIngenuo : criarPedidoSeguro;
  try {
    const pedido = await criar(req.body);
    res.status(201).json(pedido);
  } catch (erro) {
    responderErro(res, erro);
  }
});

/** Checkout ingênuo, sempre. Existe só para o teste comparativo da Etapa 3. */
app.post("/pedidos-naive", async (req, res) => {
  const problema = validarPedido(req.body);
  if (problema) return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: problema });

  try {
    const pedido = await criarPedidoIngenuo(req.body);
    res.status(201).json(pedido);
  } catch (erro) {
    responderErro(res, erro);
  }
});

// ----------------------------------------------------------------------------
// [FCCPD — Etapa 2] Rotas da fila
// ----------------------------------------------------------------------------

/**
 * Registra uma imagem de produto e ENFILEIRA o processamento dela.
 *
 * Esta rota é a demonstração mais direta do princípio: ela NÃO processa nada.
 * Grava a linha com status 'processando', deposita um job e responde
 * imediatamente 202 Accepted.
 *
 * 202 (e não 201): "aceitei o pedido, o trabalho ainda não terminou". É o código
 * HTTP honesto para operação assíncrona — dizer 200/201 seria mentir que a
 * miniatura já existe. O cliente acompanha depois pelo status da imagem.
 *
 * Aqui o enfileiramento também roda dentro de uma transação junto com o INSERT
 * da imagem: nunca existe imagem presa em 'processando' sem job para processá-la.
 */
app.post("/produtos/:id/imagens", async (req, res) => {
  const produtoId = Number(req.params.id);
  const chaveArmazenamento = req.body?.chaveArmazenamento;
  const contentType = req.body?.contentType ?? "image/jpeg";

  if (!Number.isInteger(produtoId)) {
    return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: "id de produto inválido." });
  }
  if (typeof chaveArmazenamento !== "string" || chaveArmazenamento.trim() === "") {
    return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: "chaveArmazenamento é obrigatório." });
  }

  try {
    const resultado = await comTransacao(async (cliente) => {
      const existe = await cliente.query(`SELECT 1 FROM produto WHERE id = $1`, [produtoId]);
      if (existe.rowCount === 0) throw new ProdutoInexistente(produtoId);

      const imagem = await cliente.query(
        `INSERT INTO produto_imagem (produto_id, chave_armazenamento, content_type, status)
         VALUES ($1, $2, $3, 'processando')
         RETURNING id`,
        [produtoId, chaveArmazenamento, contentType],
      );
      const imagemId = Number(imagem.rows[0].id);

      const jobId = await enfileirar(cliente, {
        tipo: "processar_imagem",
        chave: `processar-imagem:${imagemId}`,
        payload: { imagemId, produtoId, chaveArmazenamento },
      });

      return { imagemId, jobId, status: "processando" };
    });

    res.status(202).json(resultado);
  } catch (erro) {
    responderErro(res, erro);
  }
});

/** Fotografia da fila: quantos jobs em cada status + o que está na dead-letter. */
app.get("/fila", async (_req, res) => {
  try {
    res.json(await resumo(pool));
  } catch (erro) {
    responderErro(res, erro);
  }
});

/**
 * Auxiliar de teste: enfileira `quantidade` jobs de uma vez.
 *
 * Existe para o teste da Etapa 3 (200 jobs, derrubar o worker no meio, provar
 * que todos foram processados exatamente uma vez). Instrumentação de
 * laboratório, não existiria em produção.
 */
app.post("/teste/fila", async (req, res) => {
  const quantidade = Number(req.body?.quantidade ?? 200);
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 5000) {
    return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: "quantidade deve ser inteiro entre 1 e 5000." });
  }
  // Marca do lote: permite rodar o teste várias vezes sem que as chaves de
  // idempotência do lote anterior barrem os jobs novos.
  const lote = req.body?.lote ?? String(Date.now());

  try {
    const ids = await comTransacao(async (cliente) => {
      const criados = [];
      for (let i = 1; i <= quantidade; i++) {
        const jobId = await enfileirar(cliente, {
          tipo: "notificar_pedido",
          chave: `teste-carga:${lote}:${i}`,
          payload: {
            pedidoId: 0,
            usuarioId: 1,
            papel: "comprador",
            mensagem: `Job de teste ${i} do lote ${lote}.`,
          },
        });
        if (jobId !== null) criados.push(jobId);
      }
      return criados;
    });
    res.status(202).json({ ok: true, lote, enfileirados: ids.length, duplicadosIgnorados: quantidade - ids.length });
  } catch (erro) {
    responderErro(res, erro);
  }
});

/**
 * Auxiliar de teste: apaga os pedidos e recoloca o estoque no valor informado.
 * Permite rodar o teste de carga várias vezes do zero.
 *
 * Não existiria numa API de produção — é instrumentação de laboratório.
 */
app.post("/teste/reiniciar", async (req, res) => {
  const estoque = Number(req.body?.estoque ?? 10);
  if (!Number.isInteger(estoque) || estoque < 0) {
    return res.status(400).json({ erro: "CORPO_INVALIDO", mensagem: "estoque deve ser inteiro >= 0." });
  }
  try {
    await comTransacao(async (cliente) => {
      // item_pedido e pagamento têm ON DELETE CASCADE a partir de pedido,
      // então apagar pedido já limpa os dois.
      await cliente.query("DELETE FROM pedido");
      // [Etapa 2] a fila e seus efeitos também voltam ao zero, senão as chaves
      // de idempotência da rodada anterior barrariam os jobs da rodada nova.
      await cliente.query("DELETE FROM evento_assincrono");
      await cliente.query("DELETE FROM notificacao");
      await cliente.query("DELETE FROM produto_imagem");
      await cliente.query("UPDATE produto SET estoque = $1, atualizado_em = now()", [estoque]);
    });
    res.json({ ok: true, estoque });
  } catch (erro) {
    responderErro(res, erro);
  }
});

app.listen(PORTA, () => {
  console.log(`API do Origem ouvindo em http://localhost:${PORTA}`);
  console.log(`Checkout de POST /pedidos: ${NAIVE_CHECKOUT ? "INGÊNUO (com race condition)" : "SEGURO"}`);
});
