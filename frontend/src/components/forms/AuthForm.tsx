"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthForm({ cadastro = false }: { cadastro?: boolean }) {
  const [enviado, setEnviado] = useState(false);
  return <main className="mx-auto grid min-h-[calc(100vh-68px)] max-w-[1100px] items-center gap-16 px-6 py-16 md:grid-cols-2"><div><p className="section-label">Origem</p><h1 className="mt-3 font-display text-5xl leading-tight">{cadastro ? "Faça parte desta história." : "Bom ter você de volta."}</h1><p className="mt-5 max-w-md leading-7 text-[#666]">{cadastro ? "Crie sua conta para acompanhar pedidos e descobrir o trabalho de quem faz." : "Acesse sua conta para acompanhar seus pedidos e favoritos."}</p></div><form onSubmit={(event) => { event.preventDefault(); setEnviado(true); }} className="border border-[#E8E0D5] bg-white p-8 md:p-10"><h2 className="font-display text-2xl">{cadastro ? "Criar conta" : "Entrar"}</h2><label className="mt-7 block text-sm font-medium">E-mail<input required type="email" className="mt-2 w-full border border-[#E8E0D5] px-4 py-3" /></label><label className="mt-5 block text-sm font-medium">Senha<input required type="password" className="mt-2 w-full border border-[#E8E0D5] px-4 py-3" /></label><button className="btn-primary mt-7 w-full justify-center">{enviado ? "Tudo certo" : cadastro ? "Criar conta" : "Entrar"}</button><p className="mt-6 text-center text-sm text-[#888]">{cadastro ? "Já tem uma conta? " : "Ainda não tem conta? "}<Link href={cadastro ? "/login" : "/cadastro"} className="font-semibold text-[#C1522A]">{cadastro ? "Entrar" : "Cadastre-se"}</Link></p></form></main>;
}
