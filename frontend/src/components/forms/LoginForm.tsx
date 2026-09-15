"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/feedback/ErrorState";
import { ROTAS } from "@/constants/rotas";

const destinoPorPerfil = {
  comprador: ROTAS.home,
  artesao: ROTAS.painelArtesao,
  administrador: ROTAS.admin,
} as const;

export default function LoginForm() {
  const router = useRouter();
  const { entrar, carregando, erro } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const usuario = await entrar({ email, senha });
    if (usuario) router.push(destinoPorPerfil[usuario.perfil]);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="E-mail" id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="seu@email.com.br" />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="login-senha" className="text-sm font-semibold text-[#555]">
            Senha
          </label>
          <button type="button" className="text-[.8rem] font-semibold text-[#C1522A]">
            Esqueci minha senha
          </button>
        </div>
        <div className="relative">
          <input
            id="login-senha"
            type={mostrarSenha ? "text" : "password"}
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full border border-[#E8E0D5] bg-white py-3 pl-4 pr-11 text-[.9375rem]"
          />
          <button type="button" onClick={() => setMostrarSenha((atual) => !atual)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]">
            {mostrarSenha ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      {erro && <ErrorState titulo="Não foi possível entrar" mensagem={erro} />}

      <Button type="submit" className="mt-1 w-full justify-center" disabled={carregando}>
        {carregando ? "Entrando..." : "Entrar na Plataforma"}
      </Button>

      <p className="text-center text-xs text-[#aaa]">
        Demonstração: comprador@origem.com.br · maria@origem.com.br (artesã) · admin@origem.com.br — senha "origem123"
      </p>
    </form>
  );
}
