"use client";

import Link from "next/link";
import { useCarrinho } from "@/hooks/useCarrinho";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyState from "@/components/feedback/EmptyState";
import { ROTAS } from "@/constants/rotas";

export default function CartView() {
  const { itens, subtotal, frete, total, removerItem, alterarQuantidade } = useCarrinho();

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
      <Link href={ROTAS.produtos} className="text-sm text-[#888] hover:text-[#C1522A]">
        ← Continuar comprando
      </Link>
      <p className="section-label mt-10">Meu carrinho</p>
      <h1 className="mt-2 font-display text-4xl">{itens.length ? "Suas escolhas" : "Seu carrinho está vazio"}</h1>

      {itens.length === 0 ? (
        <div className="mt-10">
          <EmptyState titulo="Nenhum item no carrinho ainda" icone="🛒" acaoHref={ROTAS.produtos} acaoLabel="Explorar catálogo" />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {itens.map((item) => (
              <CartItem key={item.produto.id} item={item} onRemover={removerItem} onAlterarQuantidade={alterarQuantidade} />
            ))}
          </div>
          <CartSummary subtotal={subtotal} frete={frete} total={total} />
        </div>
      )}
    </main>
  );
}
