import type { ItemCarrinho } from "@/types/carrinho";
import { produtosService } from "./produtos.service";

export interface ProblemaEstoque {
  produtoId: number;
  nome: string;
  disponivel: number;
  solicitado: number;
}

/**
 * Revalida o estoque atual de cada item antes do checkout — os dados do carrinho ficam
 * em cache no navegador (Zustand + localStorage) e podem estar desatualizados em relação
 * à Fake API. Retorna a lista de itens que não podem mais ser atendidos como solicitado.
 */
export const carrinhoService = {
  async validarEstoque(itens: ItemCarrinho[]): Promise<ProblemaEstoque[]> {
    const produtosAtuais = await produtosService.listarTodos();
    const problemas: ProblemaEstoque[] = [];
    for (const item of itens) {
      const atual = produtosAtuais.find((produto) => produto.id === item.produto.id);
      if (!atual || atual.estoque < item.quantidade) {
        problemas.push({
          produtoId: item.produto.id,
          nome: item.produto.nome,
          disponivel: atual?.estoque ?? 0,
          solicitado: item.quantidade,
        });
      }
    }
    return problemas;
  },
};
