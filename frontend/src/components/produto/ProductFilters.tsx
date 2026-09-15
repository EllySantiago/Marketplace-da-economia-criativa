import { REGIOES } from "@/constants/regioes";
import { CATEGORIAS } from "@/constants/categorias";

export interface ValoresFiltro {
  busca: string;
  regiao: string;
  categoria: string;
  precoMax: number;
  somenteEstoque: boolean;
}

interface ProductFiltersProps {
  valores: ValoresFiltro;
  onAlterar: (valores: ValoresFiltro) => void;
}

const TODAS = "Todas";
export const PRECO_MAXIMO = 1000;

export default function ProductFilters({ valores, onAlterar }: ProductFiltersProps) {
  return (
    <aside className="space-y-6">
      <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">
        Buscar
        <input
          value={valores.busca}
          onChange={(evento) => onAlterar({ ...valores, busca: evento.target.value })}
          placeholder="Nome, técnica ou artesão"
          className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">
        Região de Pernambuco
        <select
          value={valores.regiao}
          onChange={(evento) => onAlterar({ ...valores, regiao: evento.target.value })}
          className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm"
        >
          <option>{TODAS}</option>
          {REGIOES.map((regiao) => (
            <option key={regiao}>{regiao}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">
        Categoria
        <select
          value={valores.categoria}
          onChange={(evento) => onAlterar({ ...valores, categoria: evento.target.value })}
          className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm"
        >
          <option>{TODAS}</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria}>{categoria}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">
        Preço máximo — {valores.precoMax.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        <input
          type="range"
          min={50}
          max={PRECO_MAXIMO}
          step={50}
          value={valores.precoMax}
          onChange={(evento) => onAlterar({ ...valores, precoMax: Number(evento.target.value) })}
          className="mt-3 w-full accent-[#C1522A]"
        />
      </label>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#888]">
        <input type="checkbox" checked={valores.somenteEstoque} onChange={(evento) => onAlterar({ ...valores, somenteEstoque: evento.target.checked })} className="accent-[#C1522A]" />
        Somente em estoque
      </label>
      <button type="button" onClick={() => onAlterar(FILTRO_PADRAO)} className="text-xs font-semibold uppercase tracking-[.08em] text-[#C1522A] hover:underline">
        Limpar filtros
      </button>
    </aside>
  );
}

export const FILTRO_PADRAO: ValoresFiltro = { busca: "", regiao: TODAS, categoria: TODAS, precoMax: PRECO_MAXIMO, somenteEstoque: false };
