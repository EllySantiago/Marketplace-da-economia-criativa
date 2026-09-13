import { ItemCarrinho } from './carrinho';

export interface Pedido {
  codigo: string;
  data: string;
  clienteEmail: string;
  itens: ItemCarrinho[];
  total: number;
  status: 'PENDENTE' | 'PROCESSANDO' | 'ENVIADO' | 'ENTREGUE';
  previsaoEntrega: string;
}