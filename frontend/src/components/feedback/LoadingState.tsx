interface LoadingStateProps {
  variante?: "grid" | "lista" | "texto";
  itens?: number;
  mensagem?: string;
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-[220px] bg-[#E8E0D5]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-[#E8E0D5]" />
        <div className="h-4 w-3/4 rounded bg-[#E8E0D5]" />
        <div className="h-4 w-1/2 rounded bg-[#E8E0D5]" />
      </div>
    </div>
  );
}

function SkeletonLinha() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-[#E8E0D5] py-4">
      <div className="h-16 w-16 shrink-0 rounded bg-[#E8E0D5]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/4 rounded bg-[#E8E0D5]" />
        <div className="h-4 w-2/3 rounded bg-[#E8E0D5]" />
      </div>
    </div>
  );
}

/** Estado de carregamento padrão do Origem: skeletons de grade ou lista, conforme o contexto da página. */
export default function LoadingState({ variante = "grid", itens = 6, mensagem }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{mensagem ?? "Carregando..."}</span>
      {variante === "grid" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: itens }).map((_, indice) => (
            <SkeletonCard key={indice} />
          ))}
        </div>
      )}
      {variante === "lista" && <div>{Array.from({ length: itens }).map((_, indice) => <SkeletonLinha key={indice} />)}</div>}
      {variante === "texto" && <div className="h-4 w-2/3 animate-pulse rounded bg-[#E8E0D5]" />}
    </div>
  );
}
