import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  titulo: string;
  mensagem?: string;
  icone?: ReactNode;
  acaoHref?: string;
  acaoLabel?: string;
}

/** Estado vazio padrão do Origem: quando uma busca/filtro/listagem não retorna nenhum resultado. */
export default function EmptyState({ titulo, mensagem, icone = "🔍", acaoHref, acaoLabel }: EmptyStateProps) {
  return (
    <div className="border border-[#E8E0D5] bg-white p-10 text-center">
      <p className="text-3xl" aria-hidden="true">
        {icone}
      </p>
      <p className="font-display mt-3 text-xl text-[#2C2C2C]">{titulo}</p>
      {mensagem && <p className="mt-2 text-sm text-[#888]">{mensagem}</p>}
      {acaoHref && acaoLabel && (
        <Link href={acaoHref} className="btn-primary mt-6 inline-flex">
          {acaoLabel}
        </Link>
      )}
    </div>
  );
}
