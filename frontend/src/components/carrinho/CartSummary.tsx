import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROTAS } from "@/constants/rotas";

interface CartSummaryProps {
  subtotal: number;
  frete: number;
  total: number;
}

export default function CartSummary({ subtotal, frete, total }: CartSummaryProps) {
  return (
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
  );
}
