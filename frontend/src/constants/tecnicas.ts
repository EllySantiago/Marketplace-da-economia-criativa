/** Técnicas artesanais representadas no catálogo do Origem. */
export const TECNICAS = [
  "Cerâmica",
  "Barro Cozido",
  "Renda Renascença",
  "Bordado",
  "Entalhamento em Madeira",
  "Escultura",
  "Couro Cru",
] as const;

export type Tecnica = (typeof TECNICAS)[number];
