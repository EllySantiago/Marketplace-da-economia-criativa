"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROTAS } from "@/constants/rotas";

export interface SidebarItem {
  id: string;
  label: string;
  icone: string;
  ativo: boolean;
  onClick: () => void;
}

interface SidebarProps {
  titulo: string;
  subtitulo?: string;
  itens: SidebarItem[];
  corFundo?: string;
}

/** Navegação lateral dos painéis (artesão/admin): cada item troca a seção exibida, sem recarregar a página. */
export default function Sidebar({ titulo, subtitulo, itens, corFundo = "#1B4332" }: SidebarProps) {
  const router = useRouter();
  const { sair } = useAuth();

  function handleSair() {
    sair();
    router.push(ROTAS.home);
  }

  return (
    <aside className="hide-mobile flex w-60 shrink-0 flex-col gap-1 p-5 text-white" style={{ backgroundColor: corFundo }}>
      <p className="mb-1 text-[.7rem] font-bold uppercase tracking-[.12em] text-white/50">{titulo}</p>
      {subtitulo && <p className="mb-6 text-sm text-white/80">{subtitulo}</p>}
      <nav className="flex flex-1 flex-col gap-1">
        {itens.map((item) => (
          <button key={item.id} type="button" onClick={item.onClick} className={`sidebar-nav-item text-left ${item.ativo ? "active" : ""}`} style={{ color: item.ativo ? undefined : "rgba(255,255,255,.65)" }}>
            <span aria-hidden="true">{item.icone}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <button type="button" onClick={handleSair} className="sidebar-nav-item mt-auto" style={{ color: "rgba(255,255,255,.65)" }}>
        <span aria-hidden="true">↩</span> Sair
      </button>
    </aside>
  );
}
