import type { Avaliacao } from "../types/avaliacao";

/** Avaliações sintéticas de compradores sobre produtos — usadas para popular a ficha do produto. */
export const avaliacoesMock: Avaliacao[] = [
  { id: 1, produtoId: 1, usuarioNome: "Camila Torres", nota: 5, comentario: "Peça linda, chegou muito bem embalada e com certificado de autenticidade.", criadoEm: "2026-08-22T10:00:00.000Z" },
  { id: 2, produtoId: 1, usuarioNome: "Rafael Souza", nota: 4, comentario: "Muito bonita, só achei o prazo de entrega um pouco longo.", criadoEm: "2026-08-15T14:20:00.000Z" },
  { id: 3, produtoId: 3, usuarioNome: "Juliana Prado", nota: 5, comentario: "A renda é impecável, dá pra ver o cuidado artesanal em cada detalhe.", criadoEm: "2026-08-10T09:30:00.000Z" },
  { id: 4, produtoId: 4, usuarioNome: "Bruno Ferreira", nota: 5, comentario: "Couro de altíssima qualidade, uso todo dia e já recebi vários elogios.", criadoEm: "2026-07-30T18:00:00.000Z" },
  { id: 5, produtoId: 2, usuarioNome: "Marcela Andrade", nota: 4, comentario: "Entalhe impressionante, ficou perfeito na sala.", criadoEm: "2026-07-25T11:15:00.000Z" },
];
