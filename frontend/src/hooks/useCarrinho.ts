"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

/** Camada de acesso ao carrinho: expõe os itens já com totais calculados e as ações do store. */
export function useCarrinho() {
  const itens = useCartStore((state) => state.itens);
  const adicionarItem = useCartStore((state) => state.adicionarItem);
  const removerItem = useCartStore((state) => state.removerItem);
  const alterarQuantidade = useCartStore((state) => state.alterarQuantidade);
  const limparCarrinho = useCartStore((state) => state.limparCarrinho);

  const { subtotal, quantidadeTotal, frete, total } = useMemo(() => {
    const subtotalCalculado = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
    const quantidade = itens.reduce((soma, item) => soma + item.quantidade, 0);
    const freteCalculado = subtotalCalculado === 0 || subtotalCalculado >= 400 ? 0 : 35.9;
    return {
      subtotal: subtotalCalculado,
      quantidadeTotal: quantidade,
      frete: freteCalculado,
      total: subtotalCalculado + freteCalculado,
    };
  }, [itens]);

  return { itens, subtotal, frete, total, quantidadeTotal, adicionarItem, removerItem, alterarQuantidade, limparCarrinho };
}
