"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePedido } from "@/hooks/usePedidos";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/feedback/LoadingState";
import EmptyState from "@/components/feedback/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { ROTAS } from "@/constants/rotas";

const LABEL_METODO_PAGAMENTO = { cartao: "Cartão de Crédito", pix: "Pix", boleto: "Boleto" } as const;
const ICONE_METODO_PAGAMENTO = { cartao: "💳", pix: "🔗", boleto: "🧾" } as const;

const ETAPAS = [
  { chave: "confirmado", label: "Pedido confirmado" },
  { chave: "em_producao", label: "Em produção pelo artesão" },
  { chave: "enviado", label: "Enviado" },
  { chave: "entregue", label: "Entregue" },
] as const;

export default function OrderConfirmation() {
  const codigo = useSearchParams().get("codigo");
  const { pedido, carregando } = usePedido(codigo);

  if (carregando) {
    return (
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <LoadingState variante="texto" mensagem="Carregando pedido..." />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <EmptyState titulo="Pedido não encontrado" mensagem="Verifique o código informado ou volte para a vitrine." acaoHref={ROTAS.home} acaoLabel="Voltar para a vitrine" />
      </div>
    );
  }

  const indiceEtapaAtual = pedido.status === "cancelado" ? -1 : ETAPAS.findIndex((etapa) => etapa.chave === pedido.status);

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D8F3DC] text-3xl text-[#1B4332]" aria-hidden="true">
          ✓
        </span>
        <p className="section-label mt-5">Pedido realizado com sucesso</p>
        <h1 className="font-display mt-2 text-3xl text-[#2C2C2C]">Pedido {pedido.codigo} confirmado!</h1>
        <p className="mt-2 text-sm text-[#888]">Enviamos os detalhes para {pedido.clienteEmail}.</p>
      </div>

      <div className="mt-10 bg-[#1B4332] p-6 text-white">
        <p className="section-label text-[#C1522A]">Prazo de entrega — Pernambuco</p>
        <p className="mt-1 text-sm text-white/70">Previsão: {formatDate(pedido.previsaoEntrega)}</p>
        <div className="mt-6 flex justify-between gap-2">
          {ETAPAS.map((etapa, indice) => (
            <div key={etapa.chave} className="flex-1 text-center">
              <span
                className={`mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full text-xs ${indice <= indiceEtapaAtual ? "bg-[#C1522A] text-white" : "bg-white/20 text-white/50"}`}
              >
                {indice <= indiceEtapaAtual ? "✓" : indice + 1}
              </span>
              <p className="text-[.7rem] text-white/70">{etapa.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-display text-xl">Resumo do pedido</h2>
        <ul className="mt-4 space-y-3 border-b border-[#E8E0D5] pb-4">
          {pedido.itens.map((item) => (
            <li key={item.produto.id} className="flex items-center gap-3 text-sm">
              <img src={item.produto.imagem} alt="" className="h-14 w-14 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <Badge>{item.produto.tecnica}</Badge>
                <p className="mt-1 truncate font-medium">{item.produto.nome}</p>
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
            <span>Total pago</span>
            <span className="text-[#C1522A]">{formatCurrency(pedido.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 bg-[#F5F0EB] p-6 sm:grid-cols-2">
        <div>
          <p className="section-label mb-2">Endereço de entrega</p>
          <p className="text-sm text-[#555]">{pedido.enderecoEntrega}</p>
        </div>
        <div>
          <p className="section-label mb-2">Forma de pagamento</p>
          <p className="text-sm text-[#555]">
            {ICONE_METODO_PAGAMENTO[pedido.pagamento.metodo]} {LABEL_METODO_PAGAMENTO[pedido.pagamento.metodo]} — {pedido.pagamento.status === "aprovado" ? "pagamento aprovado" : "pagamento recusado"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-[#888]">
        <span>🔒 Compra segura</span>
        <span>🎁 Embalagem artesanal</span>
        <span>📦 Entrega rastreada</span>
        <span>✅ Autenticidade garantida</span>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href={ROTAS.home} className="btn-primary">
          Voltar para a vitrine →
        </Link>
        <Link href={ROTAS.pedidos} className="btn-outline">
          Ver meus pedidos
        </Link>
      </div>
    </div>
  );
}
