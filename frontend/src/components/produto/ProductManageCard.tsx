import type { Produto } from "@/types/produto";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductManageCardProps {
  produto: Produto;
  onEditar: (produto: Produto) => void;
  onRemover: (produto: Produto) => void;
  removendo?: boolean;
}

/**
 * Card de produto do painel do artesão — mostra o estoque e ações de gestão (Editar/Remover),
 * nunca "Adicionar ao carrinho": quem está aqui é o dono do produto, não um comprador.
 */
export default function ProductManageCard({ produto, onEditar, onRemover, removendo }: ProductManageCardProps) {
  return (
    <article className="card overflow-hidden">
      <img src={produto.imagem} alt={produto.nome} className="h-40 w-full object-cover" />
      <div className="p-4">
        <Badge>{produto.tecnica}</Badge>
        <h4 className="font-display mt-2 text-[.9375rem] font-medium leading-[1.4]">{produto.nome}</h4>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base font-bold text-[#C1522A]">{formatCurrency(produto.preco)}</span>
          <span className={`text-xs font-semibold ${produto.estoque > 2 ? "text-[#2D6A4F]" : produto.estoque > 0 ? "text-[#92400E]" : "text-[#dc2626]"}`}>
            {produto.estoque > 0 ? `${produto.estoque} em estoque` : "Esgotado"}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => onEditar(produto)} className="flex-1 border border-[#E8E0D5] bg-white py-1.5 text-xs font-semibold text-[#555]">
            Editar
          </button>
          <button
            type="button"
            onClick={() => onRemover(produto)}
            disabled={removendo}
            className="flex-1 border border-[#fee2e2] bg-[#FFF5F5] py-1.5 text-xs font-semibold text-[#dc2626] disabled:opacity-50"
          >
            Remover
          </button>
        </div>
      </div>
    </article>
  );
}
