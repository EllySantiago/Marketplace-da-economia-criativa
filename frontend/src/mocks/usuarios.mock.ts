import type { Usuario } from "../types/usuario";

/**
 * Base de usuários simulada. A "senha" de demonstração para todas as contas
 * abaixo é "origem123" — validação simplificada apenas para fins acadêmicos
 * (Avaliação 1). Na Avaliação 2 isso é substituído por hash + backend real.
 */
export const SENHA_DEMO = "origem123";

export const usuariosMock: Usuario[] = [
  {
    id: 1,
    nome: "Camila Torres",
    email: "comprador@origem.com.br",
    perfil: "comprador",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format",
    criadoEm: "2025-02-10T12:00:00.000Z",
  },
  {
    id: 2,
    nome: "Maria das Graças Silva",
    email: "maria@origem.com.br",
    perfil: "artesao",
    artesaoId: 1,
    avatarUrl: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=200&h=200&fit=crop&auto=format",
    criadoEm: "2024-11-03T12:00:00.000Z",
  },
  {
    id: 3,
    nome: "João Ferreira Neto",
    email: "joao@origem.com.br",
    perfil: "artesao",
    artesaoId: 2,
    avatarUrl: "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=200&h=200&fit=crop&auto=format",
    criadoEm: "2024-12-15T12:00:00.000Z",
  },
  {
    id: 4,
    nome: "Ana Luíza Rodrigues",
    email: "ana@origem.com.br",
    perfil: "artesao",
    artesaoId: 3,
    avatarUrl: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=200&h=200&fit=crop&auto=format",
    criadoEm: "2025-01-20T12:00:00.000Z",
  },
  {
    id: 5,
    nome: "Sebastião Mendes",
    email: "sebastiao@origem.com.br",
    perfil: "artesao",
    artesaoId: 4,
    avatarUrl: "https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=200&h=200&fit=crop&auto=format",
    criadoEm: "2025-03-05T12:00:00.000Z",
  },
  {
    id: 6,
    nome: "Admin Origem",
    email: "admin@origem.com.br",
    perfil: "administrador",
    criadoEm: "2024-10-01T12:00:00.000Z",
  },
];
