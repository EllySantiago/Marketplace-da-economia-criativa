import type { DadosNovoPedido, Pedido, StatusPedido } from "@/types/pedido";
import { pedidosMock } from "@/mocks/pedidos.mock";
import { delay, ApiError } from "./client";
import { produtosService } from "./produtos.service";

const pedidos: Pedido[] = [...pedidosMock];
let proximoNumero = 4822;

const transicoesStatus: Record<StatusPedido, StatusPedido[]> = {
  pendente: ["confirmado", "cancelado"],
  confirmado: ["em_producao", "cancelado"],
  em_producao: ["enviado", "cancelado"],
  enviado: ["entregue"],
  entregue: [],
  cancelado: [],
};

export function obterProximosStatus(status: StatusPedido): StatusPedido[] {
  return [...transicoesStatus[status]];
}

function gerarCodigo(): string {
  return `PE-${proximoNumero++}`;
}

function calcularFrete(subtotal: number): number {
  return subtotal >= 400 ? 0 : 35.9;
}

export const pedidosService = {
  async listarTodos(): Promise<Pedido[]> {
    return delay([...pedidos].sort((a, b) => (a.data < b.data ? 1 : -1)));
  },

  async listarPorCliente(email: string): Promise<Pedido[]> {
    const lista = pedidos.filter((pedido) => pedido.clienteEmail.toLowerCase() === email.toLowerCase());
    return delay(lista.sort((a, b) => (a.data < b.data ? 1 : -1)));
  },

  async listarPorArtesao(artesaoId: number): Promise<Pedido[]> {
    const lista = pedidos.filter((pedido) => pedido.itens.some((item) => item.produto.artesaoId === artesaoId));
    return delay(lista.sort((a, b) => (a.data < b.data ? 1 : -1)));
  },

  async buscarPorCodigo(codigo: string): Promise<Pedido> {
    const pedido = pedidos.find((item) => item.codigo === codigo);
    if (!pedido) {
      await delay(null, 250);
      throw new ApiError(`Pedido ${codigo} não encontrado.`);
    }
    return delay(pedido);
  },

  async atualizarStatus(codigo: string, artesaoId: number, novoStatus: StatusPedido): Promise<Pedido> {
    const pedido = pedidos.find((item) => item.codigo === codigo);
    if (!pedido) {
      throw new ApiError(`Pedido ${codigo} não encontrado.`);
    }

    const autorizado = pedido.itens.some((item) => item.produto.artesaoId === artesaoId);
    if (!autorizado) {
      throw new ApiError("Você não tem permissão para atualizar este pedido.");
    }

    if (!transicoesStatus[pedido.status].includes(novoStatus)) {
      throw new ApiError(`Não é possível alterar o pedido de ${pedido.status} para ${novoStatus}.`);
    }

    pedido.status = novoStatus;
    return delay(pedido);
  },

  async criarPedido(dados: DadosNovoPedido): Promise<Pedido> {
    if (dados.itens.length === 0) {
      throw new ApiError("Não é possível confirmar um pedido sem itens.");
    }

    // Confere e baixa o estoque antes de confirmar — mesma regra descrita no DDL (seção 7):
    // evita "vender" mais peças do que o artesão realmente tem disponíveis.
    await produtosService.removerEstoque(dados.itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })));

    const subtotal = dados.itens.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
    const frete = calcularFrete(subtotal);
    const total = subtotal + frete;
    const agora = new Date();
    const previsao = new Date(agora);
    previsao.setDate(previsao.getDate() + 8);

    // Pagamento simulado (tabela `pagamento` do DDL): sempre aprovado no cenário de demonstração —
    // não existe integração real com nenhuma adquirente nesta fase do projeto.
    const pedido: Pedido = {
      codigo: gerarCodigo(),
      data: agora.toISOString(),
      clienteEmail: dados.clienteEmail,
      enderecoEntrega: dados.enderecoEntrega,
      itens: dados.itens,
      subtotal,
      frete,
      total,
      status: "confirmado",
      previsaoEntrega: previsao.toISOString(),
      pagamento: { metodo: dados.metodoPagamento, status: "aprovado", valor: total, processadoEm: agora.toISOString() },
    };
    pedidos.unshift(pedido);
    return delay(pedido, 450);
  },
};
