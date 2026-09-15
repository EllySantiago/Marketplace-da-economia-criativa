/** Regiões de Pernambuco onde atuam os artesãos cadastrados no Origem. */
export const REGIOES = ["Agreste", "Sertão", "Zona da Mata", "RMR"] as const;

export type Regiao = (typeof REGIOES)[number];
