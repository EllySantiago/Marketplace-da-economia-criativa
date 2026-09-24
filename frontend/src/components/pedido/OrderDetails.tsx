"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePedido } from "@/hooks/usePedidos";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/feedback/LoadingState";
import EmptyState from "@/components/feedback/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { ROTAS } from "@/constants/rotas";
import OrderStatus from "./OrderStatus";

const LABEL_METODO_PAGAMENTO = { cartao: "Cartão de Crédito", pix: "Pix", boleto: "Boleto" } as const;

export default function OrderDetails({ codigo }: { codigo: string }) {
  const { usuario, estaAutenticado } = useAuth();
  const { pedido, carregando } = usePedido(codigo);

  if (!estaAutenticado || !usuario) {
    return <EmptyState titulo="Entre para ver seus pedidos" acaoHref={ROTAS.login} acaoLabel="Entrar" />;
  }

  if (carregando) return <LoadingState variante="texto" mensagem="Carregando pedido..." />;

  // Só o próprio cliente (ou o administrador) pode ver o detalhe do pedido.
  const podeVer = pedido && (usuario.perfil === "administrador" || pedido.clienteEmail.toLowerCase() === usuario.email.toLowerCase());
  if (!pedido || !podeVer) {
    return <EmptyState titulo="Pedido não encontrado" mensagem="Verifique o código informado." acaoHref={ROTAS.pedidos} acaoLabel="Ver meus pedidos" />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-[#2C2C2C]">Pedido {pedido.codigo}</h1>
          <p className="mt-1 text-sm text-[#888]">Realizado em {formatDate(pedido.data)}</p>
        </div>
        <OrderStatus status={pedido.status} />
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-display text-xl">Itens</h2>
        <ul className="mt-4 space-y-3 border-b border-[#E8E0D5] pb-4">
          {pedido.itens.map((item) => (
            <li key={item.produto.id} className="flex items-center gap-3 text-sm">
              <img src={item.produto.imagem} alt="" className="h-14 w-14 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <Badge>{item.produto.tecnica}</Badge>
                <Link href={ROTAS.produto(item.produto.id)} className="mt-1 block truncate font-medium hover:text-[#C1522A]">
                  {item.produto.nome}
                </Link>
                <p className="text-xs text-[#888]">
                  por {item.produto.artesao} · Qtd {item.quantidade}
                </p>
              </div>
              <span>{formatCurrency(item.produto.preco * item.quantidade)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 bg-[#FAFAFA] p-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>{pedido.frete ? formatCurrency(pedido.frete) : "Grátis"}</span>
          </div>
          <div className="flex justify-between font-semibold text-[#2C2C2C]">
            <span>Total</span>
            <span className="text-[#C1522A]">{formatCurrency(pedido.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 bg-[#F5F0EB] p-6 sm:grid-cols-3">
        <div>
          <p className="section-label mb-2">Endereço de entrega</p>
          <p className="text-sm text-[#555]">{pedido.enderecoEntrega}</p>
        </div>
        <div>
          <p className="section-label mb-2">Previsão de entrega</p>
          <p className="text-sm text-[#555]">{pedido.status === "cancelado" ? "—" : formatDate(pedido.previsaoEntrega)}</p>
        </div>
        <div>
          <p className="section-label mb-2">Pagamento</p>
          <p className="text-sm text-[#555]">
            {LABEL_METODO_PAGAMENTO[pedido.pagamento.metodo]} — {pedido.pagamento.status === "aprovado" ? "aprovado" : "recusado"}
          </p>
        </div>
      </div>
    </div>
  );
}
