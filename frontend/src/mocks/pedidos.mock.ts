import type { Pedido } from "../types/pedido";
import { produtosMock } from "./produtos.mock";

/** Histórico inicial de pedidos, usado para popular painéis e demonstrar os indicadores. */
export const pedidosMock: Pedido[] = [
  {
    codigo: "PE-4821",
    data: "2026-08-20T14:32:00.000Z",
    clienteEmail: "comprador@origem.com.br",
    enderecoEntrega: "Rua das Flores, 120 — Boa Viagem, Recife/PE — CEP 51020-000",
    itens: [
      { produto: produtosMock[0], quantidade: 1 },
      { produto: produtosMock[3], quantidade: 1 },
    ],
    subtotal: produtosMock[0].preco + produtosMock[3].preco,
    frete: 0,
    total: produtosMock[0].preco + produtosMock[3].preco,
    status: "entregue",
    previsaoEntrega: "2026-08-28T00:00:00.000Z",
    pagamento: { metodo: "cartao", status: "aprovado", valor: produtosMock[0].preco + produtosMock[3].preco, processadoEm: "2026-08-20T14:32:00.000Z" },
  },
  {
    codigo: "PE-4790",
    data: "2026-08-10T09:15:00.000Z",
    clienteEmail: "comprador@origem.com.br",
    enderecoEntrega: "Rua das Flores, 120 — Boa Viagem, Recife/PE — CEP 51020-000",
    itens: [{ produto: produtosMock[2], quantidade: 2 }],
    subtotal: produtosMock[2].preco * 2,
    frete: 0,
    total: produtosMock[2].preco * 2,
    status: "enviado",
    previsaoEntrega: "2026-08-18T00:00:00.000Z",
    pagamento: { metodo: "pix", status: "aprovado", valor: produtosMock[2].preco * 2, processadoEm: "2026-08-10T09:15:00.000Z" },
  },
  {
    codigo: "PE-4705",
    data: "2026-07-28T18:40:00.000Z",
    clienteEmail: "outro.cliente@exemplo.com",
    enderecoEntrega: "Av. Agamenon Magalhães, 500 — Caruaru/PE — CEP 55010-000",
    itens: [{ produto: produtosMock[1], quantidade: 1 }],
    subtotal: produtosMock[1].preco,
    frete: 35.9,
    total: produtosMock[1].preco + 35.9,
    status: "confirmado",
    previsaoEntrega: "2026-08-05T00:00:00.000Z",
    pagamento: { metodo: "boleto", status: "aprovado", valor: produtosMock[1].preco + 35.9, processadoEm: "2026-07-28T18:40:00.000Z" },
  },
];
