import { artisans, products, type Page } from "../data";

interface ArtisanProfileProps {
  artisanId: number;
  navigate: (page: Page, id?: number) => void;
  onAddToCart: (productId: number) => void;
}

export default function ArtisanProfile({ artisanId, navigate, onAddToCart }: ArtisanProfileProps) {
  const artisan = artisans.find((a) => a.id === artisanId) ?? artisans[0];
  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div style={{ backgroundColor: "#FBF8F4", minHeight: "100vh" }}>
      {/* Cover */}
      <div style={{ position: "relative", height: 340, backgroundColor: "#1B4332", overflow: "hidden" }}>
        <img
          src={artisan.cover}
          alt={`Capa de ${artisan.name}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(27,67,50,0.3) 0%, rgba(27,67,50,0.85) 100%)" }} />
        <div
          className="max-w-[1440px] mx-auto px-6"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: "6rem" }}
        >
          <div className="flex items-end gap-5">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #C1522A",
                flexShrink: 0,
              }}
            />
            <div>
              <p className="section-label" style={{ color: "#D4724F", marginBottom: "0.5rem" }}>Artesão Verificado</p>
              <h1 className="font-display" style={{ fontSize: "2.5rem", fontWeight: 400, color: "white", letterSpacing: "-0.025em" }}>
                {artisan.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>📍 {artisan.city} · {artisan.region}</span>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>★ {artisan.rating}</span>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Desde {artisan.since}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges strip */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E8E0D5", padding: "1rem 1.5rem" }}>
        <div className="max-w-[1440px] mx-auto flex items-center gap-3 flex-wrap">
          {artisan.techniques.map((t) => (
            <span key={t} className="technique-badge">{t}</span>
          ))}
          <span style={{ fontSize: "0.8125rem", color: "#888", marginLeft: "auto" }}>
            {artisanProducts.length} peças disponíveis
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem" }}>
          {/* Bio sidebar */}
          <div>
            <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
                História
              </p>
              <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.85 }}>{artisan.bio}</p>
            </div>

            <div style={{ backgroundColor: "#F5F0EB", border: "1px solid #E8E0D5", borderRadius: 4, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
                Métricas
              </p>
              {[
                { label: "Total de Peças", value: artisan.productsCount },
                { label: "Avaliação", value: `★ ${artisan.rating}` },
                { label: "Artesão desde", value: artisan.since },
                { label: "Região", value: artisan.region },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #E8E0D5" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#888" }}>{m.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2C2C2C" }}>{m.value}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "#1B4332", borderRadius: 4, padding: "1.5rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Todas as peças de {artisan.name.split(" ")[0]} são autenticadas pelo Origem e acompanham certificado digital.
              </p>
              <button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "#C1522A",
                  color: "white",
                  border: "none",
                  borderRadius: 2,
                  padding: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Entrar em Contato
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, letterSpacing: "-0.02em" }}>
                Catálogo do Artesão
              </h2>
            </div>

            {artisanProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
                <p>Este artesão ainda não tem peças disponíveis.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
                {artisanProducts.map((product) => (
                  <div key={product.id} className="card group">
                    <div
                      style={{ position: "relative", overflow: "hidden", backgroundColor: "#F5F0EB", cursor: "pointer" }}
                      onClick={() => navigate("product", product.id)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <span className="technique-badge">{product.technique}</span>
                      <h3
                        className="font-display"
                        style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#2C2C2C", marginTop: "0.5rem", lineHeight: 1.4, cursor: "pointer" }}
                        onClick={() => navigate("product", product.id)}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mt-3">
                        <div className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600, color: "#C1522A" }}>
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </div>
                        <button
                          onClick={() => onAddToCart(product.id)}
                          style={{
                            backgroundColor: "#C1522A",
                            color: "white",
                            border: "none",
                            borderRadius: 2,
                            padding: "0.4rem 0.875rem",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                          }}
                        >
                          + Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
