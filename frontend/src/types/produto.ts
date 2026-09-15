export type StatusProduto = "ativo" | "inativo";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  imagens: string[];
  categoria: string;
  tecnica: string;
  regiao: string;
  artesao: string;
  artesaoId: number;
  estoque: number;
  status: StatusProduto;
}

/** Payload para criação de um novo produto pelo painel do artesão. */
export interface NovoProduto {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  tecnica: string;
  regiao: string;
  artesaoId: number;
  imagem: string;
}

export interface FiltrosProduto {
  regiao?: string;
  tecnica?: string;
  categoria?: string;
  busca?: string;
  artesaoId?: number;
}
