import type { Produto } from "../../types/produto";
import ProductCard from "./ProductCard";

interface ProductListProps { produtos: Produto[] }

export default function ProductList({ produtos }: ProductListProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24" aria-labelledby="produtos-destaque">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Peças com origem</p>
          <h2 id="produtos-destaque" className="mt-2 font-display text-4xl text-[#2C2C2C]">Escolhas da semana</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#888]">Cada peça é feita em pequena escala, com tempo, técnica e identidade.</p>
      </div>
      {produtos.length > 0 ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{produtos.map((produto) => <ProductCard key={produto.id} produto={produto} />)}</div> : <p className="border border-[#E8E0D5] bg-white p-8 text-[#555]">Nenhum produto disponível no momento.</p>}
    </section>
  );
}
