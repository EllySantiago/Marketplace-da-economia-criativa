"use client";

import { useMemo, useState } from "react";
import type { Produto } from "../../types/produto";
import ProductCard from "./ProductCard";

export default function CatalogView({ produtos }: { produtos: Produto[] }) {
  const [regiao, setRegiao] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [ordem, setOrdem] = useState("destaque");
  const [busca, setBusca] = useState("");
  const regioes = ["Todas", ...new Set(produtos.map((produto) => produto.regiao))];
  const categorias = ["Todas", ...new Set(produtos.map((produto) => produto.categoria))];
  const filtrados = useMemo(() => {
    const resultado = produtos.filter((produto) => {
      const texto = `${produto.nome} ${produto.artesao} ${produto.tecnica}`.toLowerCase();
      return (regiao === "Todas" || produto.regiao === regiao) && (categoria === "Todas" || produto.categoria === categoria) && texto.includes(busca.toLowerCase());
    });
    return [...resultado].sort((a, b) => ordem === "menor-preco" ? a.preco - b.preco : ordem === "maior-preco" ? b.preco - a.preco : a.id - b.id);
  }, [busca, categoria, ordem, produtos, regiao]);

  return <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
      <div><p className="section-label">Catálogo</p><h1 className="mt-2 font-display text-5xl text-[#2C2C2C]">Peças com história</h1><p className="mt-3 text-sm text-[#888]">{filtrados.length} peças encontradas</p></div>
      <select aria-label="Ordenar produtos" value={ordem} onChange={(event) => setOrdem(event.target.value)} className="border border-[#E8E0D5] bg-white px-4 py-3 text-sm"><option value="destaque">Destaque</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option></select>
    </div>
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6"><label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">Buscar<input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Nome ou técnica" className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm" /></label><label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">Região<select value={regiao} onChange={(event) => setRegiao(event.target.value)} className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm">{regioes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-xs font-bold uppercase tracking-[.12em] text-[#888]">Categoria<select value={categoria} onChange={(event) => setCategoria(event.target.value)} className="mt-3 w-full border border-[#E8E0D5] bg-white px-3 py-2 text-sm">{categorias.map((item) => <option key={item}>{item}</option>)}</select></label></aside>
      {filtrados.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtrados.map((produto) => <ProductCard key={produto.id} produto={produto} />)}</div> : <p className="border border-[#E8E0D5] bg-white p-8 text-[#555]">Nenhuma peça encontrada. Tente ajustar os filtros.</p>}
    </div>
  </main>;
}
