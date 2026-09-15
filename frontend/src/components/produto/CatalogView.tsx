"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProdutos } from "@/hooks/useProdutos";
import ProductCard from "./ProductCard";
import ProductFilters, { FILTRO_PADRAO, type ValoresFiltro } from "./ProductFilters";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";

export default function CatalogView() {
  const searchParams = useSearchParams();
  const [valores, setValores] = useState<ValoresFiltro>({ ...FILTRO_PADRAO, busca: searchParams.get("busca") ?? "" });
  const [ordem, setOrdem] = useState<"destaque" | "menor-preco" | "maior-preco">("destaque");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const { produtos, carregando, erro, recarregar } = useProdutos({
    regiao: valores.regiao === "Todas" ? undefined : valores.regiao,
    categoria: valores.categoria === "Todas" ? undefined : valores.categoria,
    busca: valores.busca || undefined,
  });

  const resultado = useMemo(() => {
    const filtrados = produtos.filter((produto) => produto.preco <= valores.precoMax && (!valores.somenteEstoque || produto.estoque > 0));
    return [...filtrados].sort((a, b) => {
      if (ordem === "menor-preco") return a.preco - b.preco;
      if (ordem === "maior-preco") return b.preco - a.preco;
      return a.id - b.id;
    });
  }, [produtos, valores.precoMax, valores.somenteEstoque, ordem]);

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="section-label">Catálogo</p>
          <h1 className="mt-2 font-display text-5xl text-[#2C2C2C]">Peças com história</h1>
          <p className="mt-3 text-sm text-[#888]">{carregando ? "Buscando peças..." : `${resultado.length} peças encontradas`}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setFiltrosAbertos(true)} className="btn-outline show-mobile">
            Filtros
          </button>
          <select aria-label="Ordenar produtos" value={ordem} onChange={(event) => setOrdem(event.target.value as typeof ordem)} className="border border-[#E8E0D5] bg-white px-4 py-3 text-sm">
            <option value="destaque">Destaque</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <div className="hide-mobile">
          <ProductFilters valores={valores} onAlterar={setValores} />
        </div>

        {filtrosAbertos && (
          <div className="show-mobile fixed inset-0 z-[60] bg-black/40" onClick={() => setFiltrosAbertos(false)}>
            <div className="h-full w-[280px] overflow-y-auto bg-white p-6" onClick={(evento) => evento.stopPropagation()}>
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-lg">Filtros</p>
                <button type="button" onClick={() => setFiltrosAbertos(false)} aria-label="Fechar filtros" className="text-xl leading-none text-[#888]">
                  ×
                </button>
              </div>
              <ProductFilters valores={valores} onAlterar={setValores} />
            </div>
          </div>
        )}

        <div>
          {carregando && <LoadingState variante="grid" itens={6} />}
          {!carregando && erro && <ErrorState mensagem={erro} onTentarNovamente={recarregar} />}
          {!carregando && !erro && resultado.length === 0 && (
            <EmptyState titulo="Nenhuma peça encontrada" mensagem="Tente ajustar os filtros ou o termo de busca." />
          )}
          {!carregando && !erro && resultado.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {resultado.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
