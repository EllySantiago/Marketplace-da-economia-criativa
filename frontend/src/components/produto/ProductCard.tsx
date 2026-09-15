"use client";

import Link from "next/link";
import { useState } from "react";
import type { Produto } from "@/types/produto";
import { useCarrinho } from "@/hooks/useCarrinho";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROTAS } from "@/constants/rotas";

export default function ProductCard({ produto }: { produto: Produto }) {
  const { adicionarItem } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);
  const esgotado = produto.estoque === 0;

  function handleAdicionar() {
    adicionarItem(produto, 1);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  }

  return (
    <article className="card group cursor-pointer">
      <Link href={ROTAS.produto(produto.id)} className="relative block h-[280px] overflow-hidden bg-[#F5F0EB]">
        <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {produto.precoOriginal && <span className="absolute left-3 top-3 rounded-sm bg-[#C1522A] px-2 py-1 text-[.7rem] font-bold uppercase tracking-[.08em] text-white">Oferta</span>}
        {esgotado && <span className="absolute right-3 top-3 rounded-sm bg-[#fee2e2] px-2 py-1 text-[.7rem] font-bold uppercase tracking-[.08em] text-[#dc2626]">Esgotado</span>}
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <Badge>{produto.tecnica}</Badge>
          <span className="text-xs text-[#888]">{produto.regiao}</span>
        </div>
        <Link href={ROTAS.produto(produto.id)} className="font-display block text-base font-medium leading-[1.4] text-[#2C2C2C]">
          {produto.nome}
        </Link>
        <p className="mt-1 text-[.8125rem] text-[#888]">por {produto.artesao}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl font-semibold text-[#C1522A]">{formatCurrency(produto.preco)}</p>
            {produto.precoOriginal && <p className="text-xs text-[#aaa] line-through">{formatCurrency(produto.precoOriginal)}</p>}
          </div>
          <button
            type="button"
            onClick={handleAdicionar}
            disabled={esgotado}
            className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[.04em] text-white disabled:cursor-not-allowed disabled:opacity-50 ${adicionado ? "bg-[#2D6A4F]" : "bg-[#C1522A]"}`}
          >
            {esgotado ? "Esgotado" : adicionado ? "✓ Adicionado" : "+ Carrinho"}
          </button>
        </div>
      </div>
    </article>
  );
}
