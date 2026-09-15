import type { Produto } from "@/types/produto";
import { produtosService } from "./produtos.service";
import { delay } from "./client";

/**
 * Recomendação simples por similaridade de atributos (mesma técnica, artesão ou região),
 * equivalente ao critério registrado em `recomendacao_log` no modelo de dados (docs/Origem_DDL.md).
 * Fica isolada em seu próprio serviço para poder evoluir para um modelo de IA na Avaliação 2
 * sem alterar quem a consome (hooks/componentes continuam vendo apenas `Produto[]`).
 */
export const recomendacoesService = {
  async recomendarSimilares(produtoId: number, limite = 4): Promise<Produto[]> {
    const todos = await produtosService.listarTodos();
    const referencia = todos.find((produto) => produto.id === produtoId);
    if (!referencia) return delay([]);

    const pontuados = todos
      .filter((produto) => produto.id !== produtoId)
      .map((produto) => {
        let score = 0;
        if (produto.artesaoId === referencia.artesaoId) score += 3;
        if (produto.tecnica === referencia.tecnica) score += 2;
        if (produto.regiao === referencia.regiao) score += 1;
        return { produto, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite)
      .map((item) => item.produto);

    return delay(pontuados);
  },
};
