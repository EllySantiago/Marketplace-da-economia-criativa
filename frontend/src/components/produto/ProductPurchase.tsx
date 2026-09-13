"use client";

import { useState } from "react";
import Link from "next/link";
import type { Produto } from "../../types/produto";

export default function ProductPurchase({ produto }: { produto: Produto }) {
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  return <div className="mt-8"><div className="flex items-center gap-3"><button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="h-11 w-11 border border-[#E8E0D5] bg-[#F5F0EB] text-lg">-</button><span className="flex h-11 w-12 items-center justify-center border-y border-[#E8E0D5] font-semibold">{quantidade}</span><button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))} className="h-11 w-11 border border-[#E8E0D5] bg-[#F5F0EB] text-lg">+</button><button type="button" onClick={() => setAdicionado(true)} className="btn-primary flex-1">{adicionado ? "Adicionado" : "Adicionar ao carrinho"}</button></div>{adicionado && <Link href="/carinho" className="mt-3 block text-center text-sm font-semibold text-[#1B4332]">Ver carrinho →</Link>}</div>;
}
