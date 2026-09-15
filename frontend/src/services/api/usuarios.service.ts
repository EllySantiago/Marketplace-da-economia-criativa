import type { CredenciaisLogin, DadosCadastro, Usuario } from "@/types/usuario";
import { usuariosMock, SENHA_DEMO } from "@/mocks/usuarios.mock";
import { delay, ApiError } from "./client";
import { artesoesService } from "./artesoes.service";

const usuarios: Usuario[] = [...usuariosMock];
let proximoId = Math.max(...usuarios.map((usuario) => usuario.id)) + 1;

export const usuariosService = {
  async login({ email, senha }: CredenciaisLogin): Promise<Usuario> {
    const usuario = usuarios.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!usuario || senha !== SENHA_DEMO) {
      await delay(null, 350);
      throw new ApiError("E-mail ou senha inválidos.");
    }
    return delay(usuario);
  },

  async registrar(dados: DadosCadastro): Promise<Usuario> {
    const jaExiste = usuarios.some((item) => item.email.toLowerCase() === dados.email.toLowerCase());
    if (jaExiste) {
      await delay(null, 300);
      throw new ApiError("Já existe uma conta com este e-mail.");
    }
    const usuario: Usuario = {
      id: proximoId++,
      nome: dados.nome,
      email: dados.email,
      perfil: dados.perfil,
      criadoEm: new Date().toISOString(),
    };

    // Cadastro público só existe para comprador/artesão — "administrador" é a equipe do
    // próprio Origem e nunca se autocadastra (ver docs/arquitetura.md). Todo artesão novo
    // nasce pendente de aprovação e some do catálogo até a administração revisar o cadastro.
    if (dados.perfil === "artesao") {
      const artesao = await artesoesService.criarPendente({ nome: dados.nome, cidade: "", regiao: "" });
      usuario.artesaoId = artesao.id;
    }

    usuarios.push(usuario);
    return delay(usuario, 400);
  },

  async buscarPorId(id: number): Promise<Usuario | undefined> {
    return delay(usuarios.find((usuario) => usuario.id === id));
  },
};
