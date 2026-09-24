"use client";

import { useCallback, useEffect, useState } from "react";
import type { DadosNovoPedido, Pedido, StatusPedido } from "@/types/pedido";
import { pedidosService } from "@/services/api/pedidos.service";

interface EstadoLista {
  pedidos: Pedido[];
  carregando: boolean;
  erro: string | null;
}

type Origem = { tipo: "cliente"; email: string } | { tipo: "artesao"; artesaoId: number } | { tipo: "todos" };

/** Lista pedidos por cliente, por artesão ou todos (admin) — mesmo hook, filtro por origem. */
export function usePedidos(origem: Origem) {
  const [estado, setEstado] = useState<EstadoLista>({ pedidos: [], carregando: true, erro: null });
  const [salvandoCodigo, setSalvandoCodigo] = useState<string | null>(null);
  const [erroAtualizacao, setErroAtualizacao] = useState<string | null>(null);
  const chave = JSON.stringify(origem);

  const carregar = useCallback(() => {
    setEstado((atual) => ({ ...atual, carregando: true, erro: null }));
    const origemAtual: Origem = JSON.parse(chave);
    const requisicao =
      origemAtual.tipo === "cliente"
        ? pedidosService.listarPorCliente(origemAtual.email)
        : origemAtual.tipo === "artesao"
          ? pedidosService.listarPorArtesao(origemAtual.artesaoId)
          : pedidosService.listarTodos();
    requisicao
      .then((pedidos) => setEstado({ pedidos, carregando: false, erro: null }))
      .catch((erro: Error) => setEstado({ pedidos: [], carregando: false, erro: erro.message || "Não foi possível carregar os pedidos." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /**
   * `salvandoCodigo` guarda o código do pedido em atualização (em vez de um booleano
   * único), pra que só a linha daquele pedido fique desativada/mostre "Salvando..." —
   * os outros pedidos continuam interativos normalmente.
   */
  async function atualizarStatus(codigo: string, novoStatus: StatusPedido) {
    const origemAtual: Origem = JSON.parse(chave);
    if (origemAtual.tipo !== "artesao") {
      throw new Error("Apenas artesãos podem atualizar pedidos.");
    }

    setSalvandoCodigo(codigo);
    setErroAtualizacao(null);
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(codigo, origemAtual.artesaoId, novoStatus);
      // Atualiza só o pedido alterado no estado local, em vez de recarregar a lista
      // inteira — evita o "piscar" da tela voltando pro esqueleto de carregamento.
      setEstado((atual) => ({
        ...atual,
        pedidos: atual.pedidos.map((pedido) => (pedido.codigo === codigo ? pedidoAtualizado : pedido)),
      }));
    } catch (erroCapturado) {
      const mensagem = erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível atualizar o pedido.";
      setErroAtualizacao(mensagem);
      throw erroCapturado;
    } finally {
      setSalvandoCodigo(null);
    }
  }

  return { ...estado, recarregar: carregar, atualizarStatus, salvandoCodigo, erroAtualizacao };
}

/** Busca um pedido específico pelo código (usado na tela de confirmação do checkout). */
export function usePedido(codigo: string | null) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(Boolean(codigo));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!codigo) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    setCarregando(true);
    pedidosService
      .buscarPorCodigo(codigo)
      .then((resultado) => ativo && setPedido(resultado))
      .catch((erroCapturado: Error) => ativo && setErro(erroCapturado.message))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [codigo]);

  return { pedido, carregando, erro };
}

/** Confirma o pedido a partir do carrinho (checkout) com seu próprio estado de envio/erro. */
export function useCriarPedido() {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const criar = useCallback(async (dados: DadosNovoPedido) => {
    setEnviando(true);
    setErro(null);
    try {
      return await pedidosService.criarPedido(dados);
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : "Não foi possível confirmar o pedido.");
      return null;
    } finally {
      setEnviando(false);
    }
  }, []);

  return { criar, enviando, erro };
}
