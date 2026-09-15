"use client";

import { useArtesao } from "@/hooks/useArtesoes";
import { useProdutos } from "@/hooks/useProdutos";
import ProductCard from "@/components/produto/ProductCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";

export default function ArtisanProfile({ artesaoId }: { artesaoId: number }) {
  const { artesao, carregando, erro } = useArtesao(artesaoId);
  const { produtos, carregando: carregandoProdutos } = useProdutos({ artesaoId });

  if (carregando) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <LoadingState variante="grid" itens={3} mensagem="Carregando artesão..." />
      </div>
    );
  }

  if (erro || !artesao) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <ErrorState titulo="Artesão não encontrado" mensagem={erro ?? undefined} />
      </div>
    );
  }

  return (
    <div className="bg-[#FBF8F4]">
      <section className="relative h-[340px] overflow-hidden bg-[#1B4332]">
        <img src={artesao.capaUrl} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-[#1B4332]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] items-end gap-5 px-6 pb-8">
          <img src={artesao.fotoUrl} alt={artesao.nome} className="h-28 w-28 rounded-full border-4 border-white object-cover" />
          <div>
            <p className="section-label text-[#D4724F]">Artesão Verificado</p>
            <h1 className="font-display text-4xl text-white">{artesao.nome}</h1>
            <p className="mt-1 text-sm text-white/70">
              📍 {artesao.cidade} · {artesao.regiao} &nbsp;·&nbsp; ★ {artesao.avaliacaoMedia} &nbsp;·&nbsp; Desde {artesao.desde}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E8E0D5] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-6 py-4">
          {artesao.tecnicas.map((tecnica) => (
            <Badge key={tecnica}>{tecnica}</Badge>
          ))}
          <span className="ml-auto text-sm text-[#888]">{produtos.length} peças disponíveis</span>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-6">
          <div className="border border-[#E8E0D5] bg-white p-6">
            <p className="section-label mb-3">História</p>
            <p className="text-sm leading-6 text-[#555]">{artesao.biografia}</p>
          </div>
          <div className="bg-[#F5F0EB] p-6 text-sm">
            <p className="section-label mb-3">Métricas</p>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-[#888]">Total de peças</dt>
                <dd className="font-semibold">{artesao.totalProdutos}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#888]">Avaliação</dt>
                <dd className="font-semibold">★ {artesao.avaliacaoMedia}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#888]">Artesão desde</dt>
                <dd className="font-semibold">{artesao.desde}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#888]">Região</dt>
                <dd className="font-semibold">{artesao.regiao}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div>
          <h2 className="font-display mb-6 text-2xl">Catálogo do artesão</h2>
          {carregandoProdutos ? (
            <LoadingState variante="grid" itens={4} />
          ) : produtos.length === 0 ? (
            <EmptyState titulo="Nenhuma peça publicada ainda" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {produtos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
