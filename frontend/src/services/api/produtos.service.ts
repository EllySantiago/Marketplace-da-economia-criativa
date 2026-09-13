import type { Produto } from "../../types/produto";

const produtos: Produto[] = [
  { id: 1, nome: "Cangaceiro de Barro — Lampião e Maria Bonita", descricao: "Dupla icônica do cangaço nordestino esculpida em barro cozido e pintada à mão com pigmentos naturais.", preco: 285, precoOriginal: 340, imagem: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=800&h=800&fit=crop&auto=format", imagens: ["https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1786507244330-6ad954c96ef9?w=800&h=800&fit=crop&auto=format"], categoria: "Cerâmica", tecnica: "Cerâmica", regiao: "Agreste", artesao: "Maria das Graças Silva", artesaoId: 1, estoque: 3 },
  { id: 2, nome: "Oratório São Francisco em Cedro", descricao: "Oratório em cedro-rosa entalhado à mão com detalhes em dourado folha.", preco: 620, imagem: "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=800&h=800&fit=crop&auto=format", imagens: ["https://images.unsplash.com/photo-1655138493602-49901f93d250?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1721508490084-1b1de5b230d4?w=800&h=800&fit=crop&auto=format"], categoria: "Madeira", tecnica: "Entalhamento em Madeira", regiao: "Zona da Mata", artesao: "João Ferreira Neto", artesaoId: 2, estoque: 2 },
  { id: 3, nome: "Caminho de Mesa em Renda Renascença", descricao: "Caminho de mesa em renda renascença branca com padrão floral pernambucano.", preco: 380, imagem: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=800&h=800&fit=crop&auto=format", imagens: ["https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1655149238677-9b5cb1a0afc6?w=800&h=800&fit=crop&auto=format"], categoria: "Renda", tecnica: "Renda Renascença", regiao: "RMR", artesao: "Ana Luíza Rodrigues", artesaoId: 3, estoque: 5 },
  { id: 4, nome: "Bolsa Sertaneja em Couro Cru", descricao: "Bolsa crossbody em couro cru curtido naturalmente com gravação manual.", preco: 450, precoOriginal: 520, imagem: "https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=800&h=800&fit=crop&auto=format", imagens: ["https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1599694522028-65abc96dfd2f?w=800&h=800&fit=crop&auto=format"], categoria: "Couro", tecnica: "Couro Cru", regiao: "Sertão", artesao: "Sebastião Mendes", artesaoId: 4, estoque: 7 },
  { id: 5, nome: "Família de Bonecos do Alto do Moura", descricao: "Conjunto de cinco bonecos em barro representando uma família nordestina.", preco: 195, imagem: "https://images.unsplash.com/photo-1786507244330-6ad954c96ef9?w=800&h=800&fit=crop&auto=format", categoria: "Cerâmica", tecnica: "Cerâmica", regiao: "Agreste", artesao: "Maria das Graças Silva", artesaoId: 1, estoque: 6 },
  { id: 6, nome: "Escultura Cabra do Sertão em Madeira", descricao: "Cabra do sertão esculpida em umburana, madeira tradicional do Nordeste.", preco: 340, imagem: "https://images.unsplash.com/photo-1721508490084-1b1de5b230d4?w=800&h=800&fit=crop&auto=format", categoria: "Madeira", tecnica: "Entalhamento em Madeira", regiao: "Zona da Mata", artesao: "João Ferreira Neto", artesaoId: 2, estoque: 4 },
];

export const produtosService = {
  async listarTodos(): Promise<Produto[]> {
    return produtos;
  },
  async buscarPorId(id: number): Promise<Produto | undefined> {
    return produtos.find((produto) => produto.id === id);
  },
};
