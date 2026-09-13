import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#1B4332] text-white">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-28">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4724F]">Feito em Pernambuco</p>
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">O que nasce da mão carrega uma história.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/70 md:text-lg">Encontre peças únicas, feitas por artesãos que mantêm vivas as técnicas e memórias da nossa terra.</p>
          <Link href="/produtos" className="btn-primary mt-8">Explorar a vitrine <span aria-hidden="true">→</span></Link>
        </div>
        <div className="relative hidden min-h-[360px] md:block">
          <div className="absolute inset-6 rotate-3 bg-[#C1522A]" />
          <img src="https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=900&h=900&fit=crop&auto=format" alt="Peça artesanal em barro" className="relative h-[360px] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
