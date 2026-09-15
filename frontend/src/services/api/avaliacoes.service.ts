import type { Avaliacao } from "@/types/avaliacao";
import { avaliacoesMock } from "@/mocks/avaliacoes.mock";
import { delay, ApiError } from "./client";

const avaliacoes: Avaliacao[] = [...avaliacoesMock];
let proximoId = Math.max(...avaliacoes.map((avaliacao) => avaliacao.id)) + 1;

export interface NovaAvaliacao {
  produtoId: number;
  usuarioNome: string;
  nota: number;
  comentario: string;
}

export const avaliacoesService = {
  async listarPorProduto(produtoId: number): Promise<Avaliacao[]> {
    const lista = avaliacoes.filter((avaliacao) => avaliacao.produtoId === produtoId);
    return delay(lista.sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1)));
  },

  async criar(dados: NovaAvaliacao): Promise<Avaliacao> {
    if (dados.nota < 1 || dados.nota > 5) {
      throw new ApiError("A nota precisa ser de 1 a 5.");
    }
    const avaliacao: Avaliacao = { id: proximoId++, criadoEm: new Date().toISOString(), ...dados };
    avaliacoes.unshift(avaliacao);
    return delay(avaliacao, 350);
  },
};
