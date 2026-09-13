import { Artesao } from '@/types/artesao';
import { artesoesMock } from '@/mocks/artesoes.mock';

export const artesoesService = {
  async listarTodos(): Promise<Artesao[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return artesoesMock;
  },
  async buscarPorId(id: number): Promise<Artesao | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return artesoesMock.find((a) => a.id === id);
  }
};