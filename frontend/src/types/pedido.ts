import { ItemCarrinho } from "./carrinho";

export type StatusPedido =
  | "pendente"
  | "confirmado"
  | "em_producao"
  | "enviado"
  | "entregue"
  | "cancelado";

/** Métodos de pagamento simulados — ver tabela `pagamento` em docs/Origem_DDL.md. */
export type MetodoPagamento = "cartao" | "pix" | "boleto";
export type StatusPagamento = "aprovado" | "recusado";

export interface Pagamento {
  metodo: MetodoPagamento;
  status: StatusPagamento;
  valor: number;
  processadoEm: string;
}

export interface Pedido {
  codigo: string;
  data: string;
  clienteEmail: string;
  enderecoEntrega: string;
  itens: ItemCarrinho[];
  subtotal: number;
  frete: number;
  total: number;
  status: StatusPedido;
  previsaoEntrega: string;
  pagamento: Pagamento;
}

export interface DadosNovoPedido {
  clienteEmail: string;
  enderecoEntrega: string;
  itens: ItemCarrinho[];
  metodoPagamento: MetodoPagamento;
}
