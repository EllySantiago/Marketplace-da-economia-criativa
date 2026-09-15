"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Produto } from "@/types/produto";
import { useCarrinho } from "@/hooks/useCarrinho";
import { ROTAS } from "@/constants/rotas";

export default function ProductPurchase({ produto }: { produto: Produto }) {
  const router = useRouter();
  const { adicionarItem } = useCarrinho();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const esgotado = produto.estoque === 0;

  function handleAdicionar() {
    adicionarItem(produto, quantidade);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  function handleComprarAgora() {
    adicionarItem(produto, quantidade);
    router.push(ROTAS.carrinho);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[#E8E0D5]">
          <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantidade((atual) => Math.max(1, atual - 1))} className="h-11 w-10 bg-[#F5F0EB] text-lg text-[#555]">
            −
          </button>
          <span className="flex h-11 w-12 items-center justify-center font-semibold">{quantidade}</span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantidade((atual) => Math.min(produto.estoque, atual + 1))}
            className="h-11 w-10 bg-[#F5F0EB] text-lg text-[#555]"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdicionar}
          disabled={esgotado}
          className={`flex-1 py-3.5 text-sm font-bold uppercase tracking-[.06em] text-white disabled:cursor-not-allowed disabled:opacity-50 ${adicionado ? "bg-[#2D6A4F]" : "bg-[#C1522A]"}`}
        >
          {esgotado ? "Esgotado" : adicionado ? "✓ Adicionado ao Carrinho" : "Adicionar ao Carrinho"}
        </button>
      </div>

      <button
        type="button"
        onClick={handleComprarAgora}
        disabled={esgotado}
        className="mt-3 w-full bg-[#1B4332] py-3.5 text-sm font-bold uppercase tracking-[.06em] text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Comprar Agora
      </button>

      <p className="mt-4 text-center text-xs text-[#aaa]">★ Peça com certificado de autenticidade · Frete calculado no checkout</p>
    </div>
  );
}
