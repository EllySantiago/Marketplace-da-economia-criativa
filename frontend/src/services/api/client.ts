/**
 * Simula a latência de uma chamada de rede real. Toda a "Fake API" do Origem
 * passa por aqui para que as páginas precisem, de fato, tratar os estados de
 * carregamento — exatamente como aconteceria contra o backend da Avaliação 2.
 */
export function delay<T>(valor: T, ms = 300 + Math.round(Math.random() * 200)): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

/** Erro de domínio da Fake API, para diferenciar "não encontrado"/"regra de negócio" de bugs inesperados. */
export class ApiError extends Error {}
