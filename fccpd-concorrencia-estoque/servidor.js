const express = require("express");
const { LockManager } = require("./lock");
const { FilaAssincrona } = require("./fila");

const app = express();
app.use(express.json());

const PORTA = 3001;
const ESTOQUE_INICIAL = 1; // de propósito baixo: é o cenário "última unidade" da HU09

// "Banco" em memória — simula o que hoje é o array em memória da Fake API do frontend.
let estoque = { "produto-teste": ESTOQUE_INICIAL };

const locks = new LockManager();
const fila = new FilaAssincrona({ atrasoProcessamentoMs: 300 });

function resetarEstoque() {
  estoque = { "produto-teste": ESTOQUE_INICIAL };
}

/**
 * Endpoint SEM controle de concorrência — de propósito ingênuo, só existe pra servir de
 * comparação e mostrar o problema que o lock resolve. NÃO é pra isso subir pro produto.
 *
 * O `await pausa(15)` simula o pequeno intervalo que sempre existe entre "ler o estoque"
 * e "gravar o novo valor" numa aplicação real (ex.: ida e volta ao banco). É esse
 * intervalo que abre a janela pra condição de corrida — sem ele, o event loop do Node
 * quase nunca intercalaria duas requisições no meio do "check-then-act", e o bug ficaria
 * escondido até acontecer em produção sob carga real.
 */
app.post("/checkout-sem-lock/:produtoId", async (req, res) => {
  const { produtoId } = req.params;
  const disponivel = estoque[produtoId] ?? 0;

  await pausa(15);

  if (disponivel <= 0) {
    return res.status(409).json({ ok: false, motivo: "sem estoque" });
  }

  estoque[produtoId] = disponivel - 1; // grava com base num valor que pode já estar desatualizado
  return res.json({ ok: true, estoqueRestante: estoque[produtoId] });
});

/**
 * Endpoint COM controle de concorrência — o trecho crítico (ler estoque, decidir,
 * decrementar) inteiro roda dentro de `locks.comExclusividade`, então duas requisições
 * concorrentes pro MESMO produtoId nunca executam essa sequência ao mesmo tempo.
 */
app.post("/checkout-com-lock/:produtoId", async (req, res) => {
  const { produtoId } = req.params;

  try {
    const resultado = await locks.comExclusividade(produtoId, async () => {
      const disponivel = estoque[produtoId] ?? 0;
      await pausa(15); // mesma janela de "risco" do endpoint ingênuo, só que agora protegida

      if (disponivel <= 0) {
        const erro = new Error("sem estoque");
        erro.status = 409;
        throw erro;
      }

      estoque[produtoId] = disponivel - 1;
      return { ok: true, estoqueRestante: estoque[produtoId] };
    });

    // Publica na fila SÓ depois que o checkout foi confirmado — e sem esperar o
    // processamento (a resposta ao comprador não fica presa ao envio da notificação).
    fila.publicar({ tipo: "pedido_confirmado", codigoPedido: `PE-${Date.now()}` });

    return res.json(resultado);
  } catch (erro) {
    return res.status(erro.status ?? 500).json({ ok: false, motivo: erro.message });
  }
});

app.get("/estoque/:produtoId", (req, res) => {
  res.json({ produtoId: req.params.produtoId, estoque: estoque[req.params.produtoId] ?? 0 });
});

app.post("/estoque/:produtoId/reset", (req, res) => {
  resetarEstoque();
  res.json({ ok: true, estoque });
});

app.get("/fila/log", (req, res) => {
  res.json(fila.log);
});

function pausa(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (require.main === module) {
  app.listen(PORTA, () => {
    console.log(`Servidor de demonstração (FCCPD) rodando em http://localhost:${PORTA}`);
    console.log(`Estoque inicial: ${ESTOQUE_INICIAL} unidade de "produto-teste"`);
  });
}

module.exports = { app, resetarEstoque };
