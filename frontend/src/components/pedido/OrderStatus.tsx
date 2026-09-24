import type { StatusPedido } from "@/types/pedido";

const configuracaoPorStatus: Record<StatusPedido, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-[#FEF3C7] text-[#92400E]" },
  confirmado: { label: "Confirmado", className: "bg-[#D8F3DC] text-[#1B4332]" },
  em_producao: { label: "Em produção", className: "bg-[#FEF3C7] text-[#92400E]" },
  enviado: { label: "Enviado", className: "bg-[#FEF3C7] text-[#92400E]" },
  entregue: { label: "Entregue", className: "bg-[#D8F3DC] text-[#1B4332]" },
  cancelado: { label: "Cancelado", className: "bg-[#fee2e2] text-[#dc2626]" },
};

/** Rótulos por extenso (com acentuação) de cada status — reaproveitados fora do badge,
 * por exemplo nas opções do <select> de atualização de status no painel do artesão. */
export const rotulosStatus: Record<StatusPedido, string> = Object.fromEntries(
  Object.entries(configuracaoPorStatus).map(([status, { label }]) => [status, label]),
) as Record<StatusPedido, string>;

export default function OrderStatus({ status }: { status: StatusPedido }) {
  const { label, className } = configuracaoPorStatus[status];
  return <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-[.04em] ${className}`}>{label}</span>;
}
