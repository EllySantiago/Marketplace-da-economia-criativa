"use client";

import Link from "next/link";
import { useState } from "react";
import type { Produto } from "../../types/produto";

export default function ProductCard({ produto }: { produto: Produto }) {
  const [adicionado, setAdicionado] = useState(false);
  return <article className="card group cursor-pointer">
    <Link href={`/produtos/${produto.id}`} className="relative block h-[280px] overflow-hidden bg-[#F5F0EB]">
      <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      {produto.precoOriginal && <span className="absolute left-3 top-3 rounded-sm bg-[#C1522A] px-2 py-1 text-[.7rem] font-bold uppercase tracking-[.08em] text-white">Oferta</span>}
    </Link>
    <div className="p-5">
      <div className="mb-2 flex items-center justify-between gap-3"><span className="technique-badge">{produto.tecnica}</span><span className="text-xs text-[#888]">{produto.regiao}</span></div>
      <Link href={`/produtos/${produto.id}`} className="font-display block text-base font-medium leading-[1.4] text-[#2C2C2C]">{produto.nome}</Link>
      <p className="mt-1 text-[.8125rem] text-[#888]">por {produto.artesao}</p>
      <div className="mt-4 flex items-center justify-between gap-3"><div><p className="font-display text-xl font-semibold text-[#C1522A]">{produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>{produto.precoOriginal && <p className="text-xs text-[#aaa] line-through">{produto.precoOriginal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>}</div><button type="button" onClick={() => setAdicionado(true)} className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[.04em] text-white ${adicionado ? "bg-[#2D6A4F]" : "bg-[#C1522A]"}`}>{adicionado ? "✓ Adicionado" : "+ Carrinho"}</button></div>
    </div>
  </article>;
}
