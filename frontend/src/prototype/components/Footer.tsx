export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1B4332", color: "white" }}>
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div className="col-span-2" style={{ maxWidth: 380 }}>
            <div className="flex items-center gap-2 mb-4">
              <div
                style={{ width: 32, height: 32, backgroundColor: "#C1522A", borderRadius: 2 }}
                className="flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
                  <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display text-xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                Origem
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: 320 }}>
              Marketplace dedicado ao artesanato e à economia criativa de Pernambuco. Conectamos artesãos autênticos a quem valoriza a cultura nordestina.
            </p>
            <div className="flex gap-3 mt-5">
              {["instagram", "facebook", "twitter"].map((net) => (
                <button
                  key={net}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="2" width="10" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="7" cy="7" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "1rem" }}>
              Marketplace
            </p>
            {["Vitrine", "Catálogo", "Artesãos", "Regiões", "Técnicas"].map((item) => (
              <p key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.6rem", cursor: "pointer" }}
                className="hover:text-white">
                {item}
              </p>
            ))}
          </div>

          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "1rem" }}>
              Artesão
            </p>
            {["Cadastre-se", "Painel", "Adicionar Produto", "Gestão de Pedidos", "Suporte"].map((item) => (
              <p key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.6rem", cursor: "pointer" }}
                className="hover:text-white">
                {item}
              </p>
            ))}
          </div>

          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "1rem" }}>
              Institucional
            </p>
            {["Sobre o Origem", "Missão e Valores", "Imprensa", "Contato", "Privacidade"].map((item) => (
              <p key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.6rem", cursor: "pointer" }}
                className="hover:text-white">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "3rem",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)" }}>
            © 2026 Origem — Artesanato Pernambucano. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>FEITO COM AMOR EM RECIFE, PE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
