export interface Artesao {
  id: number;
  usuarioId?: number;
  nome: string;
  nomeAtelie?: string;
  cidade: string;
  regiao: string;
  biografia: string;
  fotoUrl: string;
  capaUrl: string;
  tecnicas: string[];
  avaliacaoMedia: number;
  totalVendas: number;
  totalProdutos: number;
  /** Ano de início de atividade do artesão, exibido como "Artesão desde {desde}". */
  desde: number;
  /**
   * Todo artesão novo entra como não aprovado e some do catálogo público até a
   * administração da plataforma (perfil "administrador") revisar o cadastro.
   */
  aprovado: boolean;
}

export interface DadosNovoArtesao {
  nome: string;
  cidade: string;
  regiao: string;
  biografia?: string;
  tecnicas?: string[];
}
