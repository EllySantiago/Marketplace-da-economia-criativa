"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usuariosService } from "@/services/api/usuarios.service";
import type { CredenciaisLogin, DadosCadastro } from "@/types/usuario";

/** Sessão do usuário (comprador/artesão/administrador) simulada via Fake API + Zustand persistido. */
export function useAuth() {
  const usuario = useAuthStore((state) => state.usuario);
  const autenticar = useAuthStore((state) => state.autenticar);
  const sair = useAuthStore((state) => state.sair);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const entrar = useCallback(
    async (credenciais: CredenciaisLogin) => {
      setCarregando(true);
      setErro(null);
      try {
        const usuarioAutenticado = await usuariosService.login(credenciais);
        autenticar(usuarioAutenticado);
        return usuarioAutenticado;
      } catch (erroCapturado) {
        setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível entrar.");
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [autenticar],
  );

  const cadastrar = useCallback(
    async (dados: DadosCadastro) => {
      setCarregando(true);
      setErro(null);
      try {
        const novoUsuario = await usuariosService.registrar(dados);
        autenticar(novoUsuario);
        return novoUsuario;
      } catch (erroCapturado) {
        setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível criar a conta.");
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [autenticar],
  );

  return { usuario, estaAutenticado: Boolean(usuario), carregando, erro, entrar, cadastrar, sair };
}
