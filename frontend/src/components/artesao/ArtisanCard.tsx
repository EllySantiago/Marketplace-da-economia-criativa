import Link from "next/link";
import type { Artesao } from "@/types/artesao";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ROTAS } from "@/constants/rotas";

export default function ArtisanCard({ artesao }: { artesao: Artesao }) {
  return (
    <Link href={ROTAS.artesao(artesao.id)}>
      <Card className="group">
        <div className="relative h-40 overflow-hidden bg-[#E8E0D5]">
          <img src={artesao.fotoUrl} alt={artesao.nome} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/70 to-transparent" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <img src={artesao.fotoUrl} alt="" className="h-11 w-11 rounded-full border-2 border-[#C1522A] object-cover" />
            <div>
              <p className="text-[.9375rem] font-semibold">{artesao.nome}</p>
              <p className="text-xs text-[#888]">
                {artesao.cidade} · {artesao.regiao}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[.8125rem] leading-[1.6] text-[#555]">{artesao.biografia}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {artesao.tecnicas.slice(0, 2).map((tecnica) => (
              <Badge key={tecnica}>{tecnica}</Badge>
            ))}
          </div>
          <p className="mt-3 text-[.8125rem] text-[#888]">
            {artesao.totalVendas} vendas · ★ {artesao.avaliacaoMedia}
          </p>
        </div>
      </Card>
    </Link>
  );
}
