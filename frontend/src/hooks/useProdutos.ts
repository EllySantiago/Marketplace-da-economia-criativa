"use client";

import { useCallback, useEffect, useState } from "react";
import type { FiltrosProduto, NovoProduto, Produto } from "@/types/produto";
import { produtosService } from "@/services/api/produtos.service";

interface EstadoLista {
  produtos: Produto[];
  carregando: boolean;
  erro: string | null;
}

/** Lista produtos (com filtros opcionais), tratando os 3 estados obrigatórios: carregando/erro/vazio. */
export function useProdutos(filtros?: FiltrosProduto) {
  const [estado, setEstado] = useState<EstadoLista>({ produtos: [], carregando: true, erro: null });
  const chaveFiltros = JSON.stringify(filtros ?? {});

  const carregar = useCallback(() => {
    setEstado((atual) => ({ ...atual, carregando: true, erro: null }));
    const filtrosAtuais: FiltrosProduto = chaveFiltros ? JSON.parse(chaveFiltros) : {};
    const requisicao = Object.keys(filtrosAtuais).length ? produtosService.filtrar(filtrosAtuais) : produtosService.listarTodos();
    requisicao
      .then((produtos) => setEstado({ produtos, carregando: false, erro: null }))
      .catch((erro: Error) => setEstado({ produtos: [], carregando: false, erro: erro.message || "Não foi possível carregar os produtos." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveFiltros]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { ...estado, recarregar: carregar };
}

/** Busca um único produto por id, tratando carregando/erro/não encontrado. */
export function useProduto(id: number) {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    produtosService
      .buscarPorId(id)
      .then((resultado) => {
        if (ativo) setProduto(resultado);
      })
      .catch((erroCapturado: Error) => {
        if (ativo) setErro(erroCapturado.message || "Produto não encontrado.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [id]);

  return { produto, carregando, erro };
}

/** Cria ou edita um produto (painel do artesão) com seu próprio estado de carregamento/erro. */
export function useSalvarProduto() {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = useCallback(async (dados: NovoProduto, idParaEditar?: number) => {
    setEnviando(true);
    setErro(null);
    try {
      return idParaEditar ? await produtosService.atualizar(idParaEditar, dados) : await produtosService.criar(dados);
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível salvar o produto.");
      return null;
    } finally {
      setEnviando(false);
    }
  }, []);

  return { salvar, enviando, erro };
}

/** Remove um produto do catálogo (painel do artesão). */
export function useRemoverProduto() {
  const [removendo, setRemovendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const remover = useCallback(async (id: number) => {
    setRemovendo(true);
    setErro(null);
    try {
      await produtosService.remover(id);
      return true;
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível remover o produto.");
      return false;
    } finally {
      setRemovendo(false);
    }
  }, []);

  return { remover, removendo, erro };
}
