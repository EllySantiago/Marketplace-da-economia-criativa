"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Vitrine", href: "/" },
  { label: "Catálogo", href: "/produtos" },
  { label: "Artesãos", href: "/artesoes" },
  { label: "Painel", href: "/painel-artesao" },
  { label: "Admin", href: "/admin" },
  { label: "Login", href: "/login" },
];

function BrandMark() {
  return <span className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-[#C1522A]" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" /><path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg></span>;
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

function CartIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 3h2l.4 2M7 13h10l2-7H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" /><circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" /></svg>;
}

export default function Header() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-[#E8E0D5] bg-[#FBF8F4]"><div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-6"><Link href="/" className="flex shrink-0 items-center gap-2"><BrandMark /><span className="font-display text-xl font-semibold tracking-[-.02em] text-[#2C2C2C]">Origem</span></Link><div className="hide-mobile max-w-md flex-1"><label className="relative block"><span className="sr-only">Buscar peças, artesãos e técnicas</span><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"><SearchIcon /></span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar peças, artesãos, técnicas..." className="w-full border border-[#E8E0D5] bg-[#F5F0EB] py-2 pl-9 pr-4 text-sm text-[#2C2C2C]" /></label></div><nav className="hide-mobile flex items-center gap-5">{navLinks.map((link) => <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>)}</nav><div className="ml-auto flex items-center gap-3"><Link href="/carinho" aria-label="Abrir carrinho" className="relative flex h-10 w-10 items-center justify-center text-[#2C2C2C]"><CartIcon /></Link><Link href="/login" className="hide-mobile flex items-center gap-2 rounded-[2px] bg-[#1B4332] px-4 py-2 text-[.8125rem] font-semibold text-white"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="5" r="3" stroke="white" strokeWidth="1.4" /><path d="M1 13c0-3 2.5-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>Entrar</Link><button type="button" aria-label="Abrir menu" className="show-mobile flex h-10 w-10 items-center justify-center" onClick={() => setMenuOpen((open) => !open)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" /></svg></button></div></div>{menuOpen && <div className="show-mobile border-t border-[#E8E0D5] bg-[#FBF8F4] px-6 py-4"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar..." className="mb-3 w-full border border-[#E8E0D5] bg-[#F5F0EB] px-4 py-2 text-sm" /><nav className="flex flex-col gap-4">{navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-[#E8E0D5] py-2 text-sm font-medium text-[#2C2C2C]">{link.label}</Link>)}</nav></div>}</header>;
}
