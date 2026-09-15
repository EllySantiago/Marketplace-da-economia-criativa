"use client";

import { useCallback, useEffect, useState } from "react";
import type { Avaliacao } from "@/types/avaliacao";
import { avaliacoesService, type NovaAvaliacao } from "@/services/api/avaliacoes.service";

/** Lista as avaliações de um produto, tratando carregando/erro/vazio. */
export function useAvaliacoes(produtoId: number) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    avaliacoesService
      .listarPorProduto(produtoId)
      .then(setAvaliacoes)
      .catch((erroCapturado: Error) => setErro(erroCapturado.message))
      .finally(() => setCarregando(false));
  }, [produtoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { avaliacoes, carregando, erro, recarregar: carregar };
}

/** Envia uma nova avaliação, com seu próprio estado de envio/erro. */
export function useCriarAvaliacao() {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const criar = useCallback(async (dados: NovaAvaliacao) => {
    setEnviando(true);
    setErro(null);
    try {
      return await avaliacoesService.criar(dados);
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível enviar sua avaliação.");
      return null;
    } finally {
      setEnviando(false);
    }
  }, []);

  return { criar, enviando, erro };
}
