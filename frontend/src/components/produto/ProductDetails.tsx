"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProduto } from "@/hooks/useProdutos";
import { useArtesao } from "@/hooks/useArtesoes";
import { recomendacoesService } from "@/services/api/recomendacoes.service";
import type { Produto } from "@/types/produto";
import ProductPurchase from "./ProductPurchase";
import ProductCard from "./ProductCard";
import ProductReviews from "./ProductReviews";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROTAS } from "@/constants/rotas";

export default function ProductDetails({ produtoId }: { produtoId: number }) {
  const { produto, carregando, erro } = useProduto(produtoId);
  const { artesao } = useArtesao(produto?.artesaoId ?? -1);
  const [relacionados, setRelacionados] = useState<Produto[]>([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  useEffect(() => {
    setImagemSelecionada(0);
    if (!produto) return;
    let ativo = true;
    recomendacoesService.recomendarSimilares(produto.id, 3).then((resultado) => ativo && setRelacionados(resultado));
    return () => {
      ativo = false;
    };
  }, [produto?.id]);

  if (carregando) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <LoadingState variante="grid" itens={2} mensagem="Carregando produto..." />
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <ErrorState titulo="Produto não encontrado" mensagem={erro ?? undefined} />
      </div>
    );
  }

  return (
    <div className="bg-[#FBF8F4]">
      <div className="border-b border-[#E8E0D5] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-4 text-sm text-[#888]">
          <Link href={ROTAS.home} className="hover:text-[#C1522A]">
            Início
          </Link>{" "}
          ›{" "}
          <Link href={ROTAS.produtos} className="hover:text-[#C1522A]">
            Catálogo
          </Link>{" "}
          › {produto.nome.length > 40 ? `${produto.nome.slice(0, 40)}…` : produto.nome}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-12 md:grid-cols-2">
        <div>
          <div className="h-[520px] overflow-hidden bg-[#F5F0EB]">
            <img src={produto.imagens[imagemSelecionada] ?? produto.imagem} alt={produto.nome} className="h-full w-full object-cover" />
          </div>
          {produto.imagens.length > 1 && (
            <div className="mt-4 flex gap-3">
              {produto.imagens.map((imagem, indice) => (
                <button
                  key={imagem}
                  type="button"
                  onClick={() => setImagemSelecionada(indice)}
                  className={`h-20 w-20 overflow-hidden border-2 ${indice === imagemSelecionada ? "border-[#C1522A]" : "border-transparent"}`}
                >
                  <img src={imagem} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <Badge>{produto.tecnica}</Badge>
            <span className="text-xs text-[#888]">{produto.regiao}</span>
          </div>
          <h1 className="font-display mt-3 text-4xl text-[#2C2C2C]">{produto.nome}</h1>
          {artesao && (
            <Link href={ROTAS.artesao(artesao.id)} className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#C1522A]">
              <img src={artesao.fotoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              Criado por {artesao.nome}
            </Link>
          )}
          <p className="mt-5 leading-7 text-[#555]">{produto.descricao}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 bg-[#F5F0EB] p-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[.08em] text-[#888]">Técnica</dt>
              <dd className="mt-1 font-medium">{produto.tecnica}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[.08em] text-[#888]">Região de origem</dt>
              <dd className="mt-1 font-medium">{produto.regiao} · Pernambuco</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[.08em] text-[#888]">Artesão</dt>
              <dd className="mt-1 font-medium">{produto.artesao}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[.08em] text-[#888]">Disponibilidade</dt>
              <dd className="mt-1 font-medium">{produto.estoque > 0 ? `${produto.estoque} peças em estoque` : "Esgotado"}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-3xl font-semibold text-[#C1522A]">{formatCurrency(produto.preco)}</p>
            {produto.precoOriginal && <p className="text-base text-[#aaa] line-through">{formatCurrency(produto.precoOriginal)}</p>}
          </div>

          <ProductPurchase produto={produto} />
        </div>
      </div>

      {artesao && (
        <div className="mx-auto max-w-[1440px] px-6 pb-12">
          <div className="grid gap-6 bg-[#1B4332] p-8 md:grid-cols-[auto_1fr]">
            <img src={artesao.fotoUrl} alt={artesao.nome} className="h-24 w-24 rounded-full object-cover" />
            <div>
              <p className="section-label text-[#C1522A]">Sobre o artesão</p>
              <h2 className="font-display mt-1 text-2xl text-white">{artesao.nome}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{artesao.biografia}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {artesao.tecnicas.map((tecnica) => (
                  <Badge key={tecnica}>{tecnica}</Badge>
                ))}
              </div>
              <Link href={ROTAS.artesao(artesao.id)} className="mt-4 inline-block text-sm font-semibold text-white hover:underline">
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>
      )}

      <ProductReviews produtoId={produto.id} />

      {relacionados.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-6 pb-16">
          <p className="section-label mb-2">Você também pode gostar</p>
          <h2 className="font-display mb-6 text-2xl">Peças relacionadas</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relacionados.map((relacionado) => (
              <ProductCard key={relacionado.id} produto={relacionado} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
