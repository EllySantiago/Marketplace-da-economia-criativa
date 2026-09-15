"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAvaliacoes, useCriarAvaliacao } from "@/hooks/useAvaliacoes";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import { formatDate } from "@/utils/formatDate";

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="text-[#C1522A]" aria-label={`${nota} de 5 estrelas`}>
      {"★".repeat(nota)}
      <span className="text-[#E8E0D5]">{"★".repeat(5 - nota)}</span>
    </span>
  );
}

export default function ProductReviews({ produtoId }: { produtoId: number }) {
  const { avaliacoes, carregando, erro, recarregar } = useAvaliacoes(produtoId);
  const { criar, enviando, erro: erroEnvio } = useCriarAvaliacao();
  const { usuario } = useAuth();
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const media = useMemo(() => (avaliacoes.length ? avaliacoes.reduce((soma, item) => soma + item.nota, 0) / avaliacoes.length : 0), [avaliacoes]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!usuario) return;
    const nova = await criar({ produtoId, usuarioNome: usuario.nome, nota, comentario });
    if (nova) {
      setComentario("");
      setNota(5);
      setEnviado(true);
      recarregar();
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label mb-2">Avaliações de compradores</p>
          <h2 className="font-display text-2xl">
            {avaliacoes.length > 0 ? (
              <>
                <Estrelas nota={Math.round(media)} /> <span className="text-lg text-[#888]">{media.toFixed(1)} de 5 · {avaliacoes.length} avaliação{avaliacoes.length > 1 ? "ões" : ""}</span>
              </>
            ) : (
              "Ainda sem avaliações"
            )}
          </h2>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {carregando && <LoadingState variante="lista" itens={3} />}
          {!carregando && erro && <ErrorState mensagem={erro} onTentarNovamente={recarregar} />}
          {!carregando && !erro && avaliacoes.length === 0 && <EmptyState titulo="Nenhuma avaliação ainda" mensagem="Seja a primeira pessoa a avaliar esta peça." />}
          {!carregando && avaliacoes.length > 0 && (
            <ul className="space-y-5">
              {avaliacoes.map((avaliacao) => (
                <li key={avaliacao.id} className="border-b border-[#E8E0D5] pb-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#2C2C2C]">{avaliacao.usuarioNome}</p>
                    <span className="text-xs text-[#888]">{formatDate(avaliacao.criadoEm)}</span>
                  </div>
                  <Estrelas nota={avaliacao.nota} />
                  <p className="mt-2 text-sm leading-6 text-[#555]">{avaliacao.comentario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit border border-[#E8E0D5] bg-white p-6">
          <h3 className="font-display text-lg">Deixe sua avaliação</h3>
          {!usuario ? (
            <p className="mt-3 text-sm text-[#888]">Entre na sua conta para avaliar esta peça.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#888]">Sua nota</p>
                <div className="flex gap-1 text-xl">
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button key={valor} type="button" onClick={() => setNota(valor)} aria-label={`${valor} estrela${valor > 1 ? "s" : ""}`} className={valor <= nota ? "text-[#C1522A]" : "text-[#E8E0D5]"}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <Textarea label="Comentário" required rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Conte como foi sua experiência com a peça" />
              {erroEnvio && <ErrorState titulo="Não foi possível enviar" mensagem={erroEnvio} />}
              {enviado && <p className="text-sm font-semibold text-[#2D6A4F]">Avaliação enviada, obrigado!</p>}
              <Button type="submit" disabled={enviando} className="w-full justify-center">
                {enviando ? "Enviando..." : "Enviar avaliação"}
              </Button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
