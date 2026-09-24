import Link from "next/link";
import type { Pedido } from "@/types/pedido";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { ROTAS } from "@/constants/rotas";
import OrderStatus from "./OrderStatus";

export default function OrderCard({ pedido }: { pedido: Pedido }) {
  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={ROTAS.pedido(pedido.codigo)} className="font-display text-lg hover:text-[#C1522A]">
            Pedido {pedido.codigo}
          </Link>
          <p className="text-xs text-[#888]">{formatDate(pedido.data)}</p>
        </div>
        <OrderStatus status={pedido.status} />
      </div>
      <ul className="mt-4 space-y-2 border-t border-[#E8E0D5] pt-4">
        {pedido.itens.map((item) => (
          <li key={item.produto.id} className="flex justify-between text-sm text-[#555]">
            <span>
              {item.quantidade}× {item.produto.nome}
            </span>
            <span>{formatCurrency(item.produto.preco * item.quantidade)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-[#E8E0D5] pt-4 text-sm font-semibold">
        <span>Total</span>
        <span className="text-[#C1522A]">{formatCurrency(pedido.total)}</span>
      </div>
    </article>
  );
}
