export type CriterioRecomendacao = "mesma-tecnica" | "mesmo-artesao" | "mesma-regiao";

export interface Recomendacao {
  produtoId: number;
  criterio: CriterioRecomendacao;
  score: number;
}
