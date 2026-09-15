"use client";

import Link from "next/link";
import { useCarrinho } from "@/hooks/useCarrinho";
import CartItem from "./CartItem";
import EmptyState from "@/components/feedback/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";
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
          <aside className="h-fit border border-[#E8E0D5] bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl">Resumo do pedido</h2>
            <div className="mt-6 space-y-3 border-b border-[#E8E0D5] pb-5 text-sm text-[#555]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className={frete ? undefined : "font-semibold text-[#2D6A4F]"}>{frete ? formatCurrency(frete) : "Grátis"}</span>
              </div>
              {frete > 0 && <p className="text-xs text-[#aaa]">Frete grátis acima de R$ 400,00</p>}
            </div>
            <div className="flex justify-between py-5 font-semibold">
              <span>Total</span>
              <span className="text-xl text-[#C1522A]">{formatCurrency(total)}</span>
            </div>
            <Link href={ROTAS.checkout} className="btn-primary w-full justify-center">
              Finalizar pedido →
            </Link>
            <div className="mt-5 space-y-2 text-xs text-[#888]">
              <p>🔒 Pagamento seguro</p>
              <p>🎁 Embalagem artesanal</p>
              <p>📦 Entrega rastreada</p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
