import type { Artesao, DadosNovoArtesao } from "@/types/artesao";
import { artesoesMock } from "@/mocks/artesoes.mock";
import { delay, ApiError } from "./client";

const artesoes: Artesao[] = [...artesoesMock];
let proximoId = Math.max(...artesoes.map((artesao) => artesao.id)) + 1;

export const artesoesService = {
  /** Só retorna artesãos já aprovados pela administração — é o que aparece na vitrine pública. */
  async listarTodos(): Promise<Artesao[]> {
    return delay(artesoes.filter((artesao) => artesao.aprovado));
  },

  async buscarPorId(id: number): Promise<Artesao> {
    const artesao = artesoes.find((item) => item.id === id);
    if (!artesao) {
      await delay(null, 300);
      throw new ApiError(`Artesão ${id} não encontrado.`);
    }
    return delay(artesao);
  },

  /** Usado internamente pelo cadastro (usuariosService.registrar) e por telas que já sabem o id. */
  async buscarPorIdInterno(id: number): Promise<Artesao | undefined> {
    return delay(artesoes.find((item) => item.id === id));
  },

  /** Cria o registro de artesão associado a um novo cadastro — entra sempre como não aprovado. */
  async criarPendente(dados: DadosNovoArtesao): Promise<Artesao> {
    const artesao: Artesao = {
      id: proximoId++,
      nome: dados.nome,
      cidade: dados.cidade || "A definir",
      regiao: dados.regiao || "A definir",
      biografia: dados.biografia ?? "",
      fotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&auto=format",
      capaUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&h=400&fit=crop&auto=format",
      tecnicas: dados.tecnicas ?? [],
      avaliacaoMedia: 0,
      totalVendas: 0,
      totalProdutos: 0,
      desde: new Date().getFullYear(),
      aprovado: false,
    };
    artesoes.push(artesao);
    return delay(artesao, 400);
  },

  /** Fila de aprovação exibida no Painel Administrativo. */
  async listarPendentes(): Promise<Artesao[]> {
    return delay(artesoes.filter((artesao) => !artesao.aprovado));
  },

  async aprovar(id: number): Promise<Artesao> {
    const artesao = artesoes.find((item) => item.id === id);
    if (!artesao) throw new ApiError(`Artesão ${id} não encontrado.`);
    artesao.aprovado = true;
    return delay(artesao, 300);
  },

  async rejeitar(id: number): Promise<void> {
    const indice = artesoes.findIndex((item) => item.id === id);
    if (indice === -1) throw new ApiError(`Artesão ${id} não encontrado.`);
    artesoes.splice(indice, 1);
    await delay(null, 300);
  },
};
