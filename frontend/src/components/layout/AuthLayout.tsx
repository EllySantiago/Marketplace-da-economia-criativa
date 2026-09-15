"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { ROTAS } from "@/constants/rotas";

type Aba = "login" | "cadastro";

export default function AuthLayout({ abaInicial }: { abaInicial: Aba }) {
  const router = useRouter();

  function trocarAba(aba: Aba) {
    router.push(aba === "login" ? ROTAS.login : ROTAS.cadastro);
  }

  return (
    <div className="grid min-h-screen bg-[#FBF8F4] md:grid-cols-2">
      {/* Painel esquerdo — decorativo, replica o painel do protótipo do Figma Make */}
      <div className="hide-mobile relative flex flex-col justify-end overflow-hidden bg-[#1B4332] p-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=900&h=1200&fit=crop&auto=format)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(175deg,rgba(27,67,50,.6)_0%,rgba(27,67,50,.97)_70%)]" />

        <div className="absolute left-12 top-10 z-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-[#C1522A]" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-xl font-semibold text-white">Origem</span>
        </div>

        <div className="relative z-10">
          <p className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] tracking-[-.025em] text-white">
            "Cada peça carrega
            <br />
            <em className="italic text-[#C1522A]">gerações de saber."</em>
          </p>
          <p className="mb-10 mt-5 max-w-[380px] text-sm leading-[1.8] text-white/55">
            Conectando o artesanato autêntico de Pernambuco com quem entende o valor do feito à mão.
          </p>

          <div className="flex max-w-[380px] items-center gap-4 rounded bg-white/[.07] p-5 backdrop-blur-md">
            <img
              src="https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=80&h=80&fit=crop&auto=format"
              alt="Maria das Graças"
              className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-[#C1522A] object-cover"
            />
            <div>
              <p className="text-[.9375rem] font-semibold text-white">Maria das Graças Silva</p>
              <p className="text-[.8rem] text-white/50">Caruaru · Cerâmica · Artesã desde 1993</p>
              <div className="mt-1 flex gap-[.3rem] text-xs text-[#C1522A]">★★★★★</div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <div className="show-mobile mb-8 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#C1522A]" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-xl font-semibold text-[#2C2C2C]">Origem</span>
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8 inline-flex gap-1 bg-[#F5F0EB] p-1">
            <button
              type="button"
              onClick={() => trocarAba("login")}
              className={`rounded-sm px-6 py-2 text-sm font-semibold ${abaInicial === "login" ? "bg-white text-[#2C2C2C] shadow" : "text-[#888]"}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => trocarAba("cadastro")}
              className={`rounded-sm px-6 py-2 text-sm font-semibold ${abaInicial === "cadastro" ? "bg-white text-[#2C2C2C] shadow" : "text-[#888]"}`}
            >
              Criar Conta
            </button>
          </div>

          <h1 className="font-display text-[2rem] leading-tight tracking-[-.025em] text-[#2C2C2C]">{abaInicial === "cadastro" ? "Crie sua conta." : "Bem-vindo de volta."}</h1>
          <p className="mb-7 mt-2 text-sm leading-[1.6] text-[#888]">
            {abaInicial === "cadastro" ? "Junte-se ao Origem e conecte-se com a cultura autêntica de Pernambuco." : "Acesse sua conta para continuar explorando o artesanato pernambucano."}
          </p>

          {abaInicial === "login" ? <LoginForm /> : <RegisterForm />}

          <p className="mt-7 text-center text-sm text-[#888]">
            {abaInicial === "login" ? "Ainda não tem conta? " : "Já tem uma conta? "}
            <button type="button" onClick={() => trocarAba(abaInicial === "login" ? "cadastro" : "login")} className="font-bold text-[#C1522A]">
              {abaInicial === "login" ? "Criar agora" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
