export type PerfilUsuario = "comprador" | "artesao" | "administrador";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  avatarUrl?: string;
  /** Preenchido apenas quando perfil === "artesao": vincula o usuário ao seu registro de artesão. */
  artesaoId?: number;
  criadoEm: string;
}

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
}
