// ============================================================================
// Tudo que é COMUM às duas versões do checkout (segura e ingênua).
//
// A razão de este arquivo existir: manter checkout-seguro.js e
// checkout-ingenuo.js idênticos em tudo, EXCETO no trecho da baixa de estoque.
// Assim a diferença entre "tem race condition" e "não tem" fica isolada e
// visível, sem ruído de código repetido no meio.
// ============================================================================

/** Não havia estoque suficiente no momento da compra. Vira HTTP 409 Conflict. */
export class EstoqueInsuficiente extends Error {
  constructor(produtoId) {
    super(`Estoque insuficiente para o produto ${produtoId}.`);
    this.name = "EstoqueInsuficiente";
    this.produtoId = produtoId;
  }
}

/** O produto não existe ou está inativo. Vira HTTP 404 Not Found. */
export class ProdutoInexistente extends Error {
  constructor(produtoId) {
    super(`Produto ${produtoId} não encontrado ou inativo.`);
    this.name = "ProdutoInexistente";
    this.produtoId = produtoId;
  }
}

const SUBTOTAL_PARA_FRETE_GRATIS = 400;
const VALOR_FRETE = 35.9;

/** Mesma regra de frete do frontend (useCarrinho/checkout), para o total não "pular". */
export function calcularFrete(subtotal) {
  return subtotal >= SUBTOTAL_PARA_FRETE_GRATIS ? 0 : VALOR_FRETE;
}

/** Dinheiro em ponto flutuante acumula erro de arredondamento; fixamos em 2 casas. */
export function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Descobre POR QUE a baixa de estoque não afetou nenhuma linha.
 *
 * O UPDATE condicional afeta 0 linhas em dois casos diferentes: o produto não
 * existe/está inativo, ou existe mas não tem saldo. Para a API responder o
 * código HTTP correto (404 x 409), fazemos esta consulta extra — que só roda no
 * caminho de rejeição, nunca no caminho de sucesso, portanto não custa nada no
 * fluxo normal.
 */
export async function explicarFalhaDeEstoque(cliente, produtoId) {
  const existe = await cliente.query(
    `SELECT 1 FROM produto WHERE id = $1 AND status = 'ativo'`,
    [produtoId],
  );
  return existe.rowCount === 0
    ? new ProdutoInexistente(produtoId)
    : new EstoqueInsuficiente(produtoId);
}

/**
 * Grava o pedido, seus itens e o pagamento simulado.
 *
 * Roda DENTRO da transação já aberta (recebe o `cliente`, não o pool). Por isso
 * é seguro: se qualquer INSERT falhar, o ROLLBACK de quem abriu a transação
 * desfaz também a baixa de estoque feita antes.
 *
 * `itensConfirmados` são os itens cuja baixa de estoque JÁ foi aplicada com
 * sucesso — o preço usado é o que veio do banco naquele momento, não o que o
 * navegador do comprador mandou (o cliente nunca dita o preço).
 */
export async function gravarPedido(cliente, { compradorId, enderecoEntrega, metodoPagamento, itensConfirmados }) {
  const subtotal = arredondar(
    itensConfirmados.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0),
  );
  const frete = calcularFrete(subtotal);
  const total = arredondar(subtotal + frete);

  const pedido = await cliente.query(
    `INSERT INTO pedido (comprador_id, status, endereco_entrega, valor_total)
     VALUES ($1, 'confirmado', $2, $3)
     RETURNING id, criado_em`,
    [compradorId, enderecoEntrega, total],
  );

  // BIGSERIAL (int8) chega no Node como string, para não perder precisão em
  // números gigantes. Convertemos para número aqui.
  const pedidoId = Number(pedido.rows[0].id);

  for (const item of itensConfirmados) {
    await cliente.query(
      `INSERT INTO item_pedido (pedido_id, produto_id, artesao_id, quantidade, preco_unitario, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        pedidoId,
        item.produtoId,
        item.artesaoId,
        item.quantidade,
        item.precoUnitario,
        arredondar(item.precoUnitario * item.quantidade),
      ],
    );
  }

  // Pagamento simulado (tabela `pagamento` do DDL): sempre aprovado nesta fase
  // do projeto — não existe integração com adquirente real.
  await cliente.query(
    `INSERT INTO pagamento (pedido_id, metodo, status, valor)
     VALUES ($1, $2, 'aprovado', $3)`,
    [pedidoId, metodoPagamento ?? "simulado", total],
  );

  return {
    pedidoId,
    criadoEm: pedido.rows[0].criado_em,
    subtotal,
    frete,
    total,
    itens: itensConfirmados,
  };
}
