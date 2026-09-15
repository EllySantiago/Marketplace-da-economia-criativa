"use client";

import { useCallback, useEffect, useState } from "react";
import type { Artesao } from "@/types/artesao";
import { artesoesService } from "@/services/api/artesoes.service";

/** Lista todos os artesãos, tratando carregando/erro/vazio. */
export function useArtesoes() {
  const [artesoes, setArtesoes] = useState<Artesao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    artesoesService
      .listarTodos()
      .then((resultado) => ativo && setArtesoes(resultado))
      .catch((erroCapturado: Error) => ativo && setErro(erroCapturado.message))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  return { artesoes, carregando, erro };
}

/** Busca um artesão por id, tratando carregando/erro/não encontrado. */
export function useArtesao(id: number) {
  const [artesao, setArtesao] = useState<Artesao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    artesoesService
      .buscarPorId(id)
      .then((resultado) => ativo && setArtesao(resultado))
      .catch((erroCapturado: Error) => ativo && setErro(erroCapturado.message || "Artesão não encontrado."))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [id]);

  return { artesao, carregando, erro };
}

/** Fila de artesãos pendentes de aprovação, usada no Painel Administrativo. */
export function useArtesoesPendentes() {
  const [pendentes, setPendentes] = useState<Artesao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    artesoesService
      .listarPendentes()
      .then(setPendentes)
      .catch((erroCapturado: Error) => setErro(erroCapturado.message))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aprovar(id: number) {
    await artesoesService.aprovar(id);
    carregar();
  }

  async function rejeitar(id: number) {
    await artesoesService.rejeitar(id);
    carregar();
  }

  return { pendentes, carregando, erro, aprovar, rejeitar };
}
