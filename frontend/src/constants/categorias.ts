/** Categorias de produto exibidas nos filtros da vitrine e do catálogo. */
export const CATEGORIAS = ["Cerâmica", "Madeira", "Renda", "Couro"] as const;

export type Categoria = (typeof CATEGORIAS)[number];
