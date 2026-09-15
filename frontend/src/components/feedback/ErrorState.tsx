interface ErrorStateProps {
  titulo?: string;
  mensagem?: string;
  onTentarNovamente?: () => void;
}

/** Estado de erro padrão do Origem: usado sempre que uma chamada à Fake API é rejeitada. */
export default function ErrorState({ titulo = "Algo deu errado", mensagem, onTentarNovamente }: ErrorStateProps) {
  return (
    <div role="alert" className="border border-[#f3c9bd] bg-[#FBF0EC] p-8 text-center">
      <p className="text-2xl" aria-hidden="true">
        ⚠️
      </p>
      <p className="font-display mt-3 text-xl text-[#2C2C2C]">{titulo}</p>
      {mensagem && <p className="mt-2 text-sm text-[#666]">{mensagem}</p>}
      {onTentarNovamente && (
        <button type="button" onClick={onTentarNovamente} className="btn-outline mt-5">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
