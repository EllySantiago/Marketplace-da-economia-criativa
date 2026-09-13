export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  tecnica: string;
  regiao: string;
  artesao: string;
  estoque: number;
  precoOriginal?: number;
  imagens?: string[];
  artesaoId?: number;
}
