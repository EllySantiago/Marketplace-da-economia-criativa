"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/feedback/ErrorState";
import { ROTAS } from "@/constants/rotas";
import type { PerfilUsuario } from "@/types/usuario";

/**
 * Só existem duas opções de autocadastro. "Administrador" é a equipe do próprio Origem
 * (contas provisionadas internamente, sem tela pública de cadastro) — ver docs/arquitetura.md.
 */
const perfis: { id: PerfilUsuario; label: string; icone: string; descricao: string }[] = [
  { id: "comprador", label: "Comprador", icone: "🛍️", descricao: "Explore e adquira peças únicas" },
  { id: "artesao", label: "Artesão", icone: "🧑‍🎨", descricao: "Publique e venda suas criações" },
];

function CampoSenha({ id, label, valor, onChange }: { id: string; label: string; valor: string; onChange: (valor: string) => void }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#555]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visivel ? "text" : "password"}
          required
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full border border-[#E8E0D5] bg-white py-3 pl-4 pr-11 text-[.9375rem]"
        />
        <button type="button" onClick={() => setVisivel((atual) => !atual)} aria-label={visivel ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]">
          {visivel ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { cadastrar, carregando, erro } = useAuth();
  const [perfil, setPerfil] = useState<PerfilUsuario>("comprador");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (senha !== confirmarSenha) {
      setErroLocal("As senhas não coincidem.");
      return;
    }
    setErroLocal(null);
    const usuario = await cadastrar({ nome, email, senha, perfil });
    if (usuario) router.push(usuario.perfil === "artesao" ? ROTAS.painelArtesao : ROTAS.home);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.1em] text-[#888]">Tipo de conta</p>
        <div className="grid grid-cols-2 gap-2">
          {perfis.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              onClick={() => setPerfil(opcao.id)}
              className={`flex flex-col items-center gap-1.5 rounded border p-3.5 ${perfil === opcao.id ? "border-2 border-[#C1522A] bg-[#FFF7F4]" : "border-[#E8E0D5] bg-white"}`}
            >
              <span className="text-[1.375rem]">{opcao.icone}</span>
              <span className={`text-xs font-bold ${perfil === opcao.id ? "text-[#C1522A]" : "text-[#555]"}`}>{opcao.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#aaa]">{perfis.find((opcao) => opcao.id === perfil)?.descricao}</p>
      </div>

      <Input label="Nome completo" id="cadastro-nome" required value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" placeholder="Seu nome completo" />
      <Input label="E-mail" id="cadastro-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="seu@email.com.br" />
      <CampoSenha id="cadastro-senha" label="Senha" valor={senha} onChange={setSenha} />
      <CampoSenha id="cadastro-confirmar" label="Confirmar senha" valor={confirmarSenha} onChange={setConfirmarSenha} />

      {perfil === "artesao" && (
        <div className="flex gap-3 border border-[#E8E0D5] bg-[#F5F0EB] p-4 text-[.8125rem] leading-[1.6] text-[#555]">
          <span className="shrink-0 text-lg">📋</span>
          <p>Cadastros de artesão passam por revisão da administração do Origem antes de aparecerem na vitrine pública — normalmente em até 48 horas.</p>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2.5">
        <input type="checkbox" required checked={aceiteTermos} onChange={(e) => setAceiteTermos(e.target.checked)} className="mt-0.5 shrink-0 accent-[#C1522A]" />
        <span className="text-[.8125rem] leading-[1.6] text-[#555]">
          Concordo com os <span className="font-semibold text-[#C1522A]">Termos de Uso</span> e a <span className="font-semibold text-[#C1522A]">Política de Privacidade</span> do Origem.
        </span>
      </label>

      {(erroLocal || erro) && <ErrorState titulo="Não foi possível criar a conta" mensagem={erroLocal ?? erro ?? undefined} />}

      <Button type="submit" className="mt-1 w-full justify-center" disabled={carregando}>
        {carregando ? "Criando conta..." : "Criar Minha Conta"}
      </Button>
    </form>
  );
}
