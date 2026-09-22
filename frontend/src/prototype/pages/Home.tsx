import { useState } from "react";
import { products, artisans, type Page } from "../data";

interface HomeProps {
  navigate: (page: Page, id?: number) => void;
  onAddToCart: (productId: number) => void;
}

const categories = ["Todos", "Cerâmica", "Renda", "Madeira", "Couro", "Esculturas"];

export default function Home({ navigate, onAddToCart }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [addedId, setAddedId] = useState<number | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  function handleAdd(id: number) {
    onAddToCart(id);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div style={{ backgroundColor: "#FBF8F4" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "#1B4332",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=1600&h=900&fit=crop&auto=format)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(27,67,50,0.95) 0%, rgba(193,82,42,0.4) 100%)" }} />

        <div className="max-w-[1440px] mx-auto px-6 w-full" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontWeight: 400,
                color: "white",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                marginBottom: "1.5rem",
              }}
            >
              Arte que carrega
              <br />
              <em style={{ color: "#C1522A", fontStyle: "italic" }}>a alma do sertão.</em>
            </h1>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 520 }}>
              Descubra peças únicas criadas por mestres artesãos de Pernambuco. Do Alto do Moura a Olinda, cada peça conta uma história de séculos.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary" onClick={() => navigate("catalog")}>
                Explorar Coleção
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }} onClick={() => navigate("artisan")}>
                Conhecer Artesãos
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { value: "200+", label: "Artesãos Cadastrados" },
                { value: "1.4k", label: "Peças Disponíveis" },
                { value: "4.9★", label: "Avaliação Média" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display" style={{ fontSize: "2rem", fontWeight: 600, color: "#C1522A", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div
          style={{
            position: "absolute",
            right: "5%",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            padding: "1.5rem",
            backdropFilter: "blur(8px)",
            maxWidth: 260,
            zIndex: 1,
          }}
          className="hide-mobile"
        >
          <img
            src="https://images.unsplash.com/photo-1786507244330-6ad954c96ef9?w=500&h=400&fit=crop&auto=format"
            alt="Cerâmica pernambucana em destaque"
            style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 2, marginBottom: "1rem" }}
          />
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>Destaque da semana</p>
          <p className="font-display" style={{ fontSize: "1rem", color: "white", fontWeight: 500 }}>
            Cerâmica Alto do Moura
          </p>
          <p style={{ fontSize: "0.875rem", color: "#C1522A", fontWeight: 600, marginTop: "0.5rem" }}>A partir de R$ 185,00</p>
        </div>
      </section>

      {/* Filter pills */}
      <section style={{ backgroundColor: "white", borderBottom: "1px solid #E8E0D5", position: "sticky", top: 68, zIndex: 40 }}>
        <div className="max-w-[1440px] mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Produtos em Destaque</p>
            <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 400, color: "#2C2C2C", letterSpacing: "-0.02em" }}>
              Peças únicas para levar para casa
            </h2>
          </div>
          <button className="btn-outline hide-mobile" onClick={() => navigate("catalog")}>
            Ver Catálogo Completo
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((product) => (
            <div key={product.id} className="card group" style={{ cursor: "pointer" }}>
              <div
                style={{ position: "relative", overflow: "hidden", backgroundColor: "#F5F0EB" }}
                onClick={() => navigate("product", product.id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                {product.originalPrice && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "#C1522A",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "0.2rem 0.6rem",
                      borderRadius: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    Oferta
                  </div>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="technique-badge">{product.technique}</span>
                  <span style={{ fontSize: "0.75rem", color: "#888" }}>{product.region}</span>
                </div>
                <h3
                  className="font-display"
                  style={{ fontSize: "1rem", fontWeight: 500, color: "#2C2C2C", marginBottom: "0.4rem", lineHeight: 1.4, cursor: "pointer" }}
                  onClick={() => navigate("product", product.id)}
                >
                  {product.title}
                </h3>
                <button
                  style={{ fontSize: "0.8125rem", color: "#888", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onClick={() => navigate("artisan", product.artisanId)}
                >
                  por {product.artisanName}
                </button>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <div className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#C1522A" }}>
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </div>
                    {product.originalPrice && (
                      <div style={{ fontSize: "0.75rem", color: "#aaa", textDecoration: "line-through" }}>
                        R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(product.id)}
                    style={{
                      backgroundColor: addedId === product.id ? "#2D6A4F" : "#C1522A",
                      color: "white",
                      border: "none",
                      borderRadius: 2,
                      padding: "0.5rem 1rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {addedId === product.id ? "✓ Adicionado" : "+ Carrinho"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story section */}
      <section style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-20">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "center",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            <div>
              <p className="section-label" style={{ color: "#C1522A", marginBottom: "1.5rem" }}>
                Nossa Missão
              </p>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}
              >
                Preservando a cultura através do comércio justo
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                O Origem nasceu da convicção de que o artesanato pernambucano merece o mesmo palco que qualquer produto do design contemporâneo. Conectamos mestres artesãos do Agreste, Sertão, Zona da Mata e Grande Recife a consumidores que entendem o valor do feito à mão.
              </p>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
                Cada compra representa renda direta para o artesão, sem intermediários desnecessários. Garantimos rastreabilidade, autenticidade e um preço justo pelo trabalho de décadas.
              </p>
              <button className="btn-primary" onClick={() => navigate("artisan")}>
                Conheça os Artesãos
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <img
                src="https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=600&h=700&fit=crop&auto=format"
                alt="Artesã criando esculturas de barro"
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 4, gridRow: "span 2" }}
              />
              <img
                src="https://images.unsplash.com/photo-1655138493602-49901f93d250?w=400&h=300&fit=crop&auto=format"
                alt="Esculturas em madeira"
                style={{ width: "100%", height: 152, objectFit: "cover", borderRadius: 4 }}
              />
              <img
                src="https://images.unsplash.com/photo-1659644569209-1c397e64f7c6?w=400&h=300&fit=crop&auto=format"
                alt="Artesão trabalhando"
                style={{ width: "100%", height: 152, objectFit: "cover", borderRadius: 4 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artisan highlights */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Mestres Artesãos</p>
            <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 400, letterSpacing: "-0.02em" }}>
              Conheça quem faz acontecer
            </h2>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("artisan", artisan.id)}
            >
              <div style={{ position: "relative", height: 160, backgroundColor: "#E8E0D5", overflow: "hidden" }}>
                <img
                  src={artisan.cover}
                  alt={artisan.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,67,50,0.7) 0%, transparent 60%)" }} />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #C1522A" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#2C2C2C" }}>{artisan.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>{artisan.city} · {artisan.region}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {artisan.bio.substring(0, 110)}…
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {artisan.techniques.slice(0, 2).map((t) => (
                    <span key={t} className="technique-badge">{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#888" }}>
                  {artisan.productsCount} peças · ★ {artisan.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ backgroundColor: "#C1522A", padding: "5rem 1.5rem" }}>
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "white", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Você é artesão pernambucano?
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.75)", marginBottom: "2rem" }}>
            Cadastre-se no Origem e leve seu trabalho para o mundo inteiro.
          </p>
          <button className="btn-outline" style={{ borderColor: "white", color: "white" }} onClick={() => navigate("dashboard")}>
            Criar Meu Painel de Artesão
          </button>
        </div>
      </section>
    </div>
  );
}
