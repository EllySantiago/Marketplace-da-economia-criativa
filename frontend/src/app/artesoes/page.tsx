"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { useArtesoes } from "@/hooks/useArtesoes";
import ArtisanCard from "@/components/artesao/ArtisanCard";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";

export default function ArtesoesPage() {
  const { artesoes, carregando, erro } = useArtesoes();

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <p className="section-label">Mestres Artesãos</p>
        <h1 className="mt-2 font-display text-5xl text-[#2C2C2C]">Quem faz o Origem acontecer</h1>
        <p className="mt-3 max-w-xl text-sm text-[#888]">Artesãos verificados do Agreste, Sertão, Zona da Mata e Região Metropolitana do Recife.</p>

        <div className="mt-10">
          {carregando && <LoadingState variante="grid" itens={4} mensagem="Carregando artesãos..." />}
          {!carregando && erro && <ErrorState mensagem={erro} />}
          {!carregando && !erro && artesoes.length === 0 && <EmptyState titulo="Nenhum artesão cadastrado ainda" />}
          {!carregando && !erro && artesoes.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {artesoes.map((artesao) => (
                <ArtisanCard key={artesao.id} artesao={artesao} />
              ))}
            </div>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}
