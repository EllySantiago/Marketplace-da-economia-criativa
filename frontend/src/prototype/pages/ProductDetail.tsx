import { useState } from "react";
import { products, artisans, type Page } from "../data";

interface ProductDetailProps {
  productId: number;
  navigate: (page: Page, id?: number) => void;
  onAddToCart: (productId: number, qty: number) => void;
}

export default function ProductDetail({ productId, navigate, onAddToCart }: ProductDetailProps) {
  const product = products.find((p) => p.id === productId) ?? products[0];
  const artisan = artisans.find((a) => a.id === product.artisanId) ?? artisans[0];
  const related = products.filter((p) => p.id !== product.id && (p.artisanId === product.artisanId || p.category === product.category)).slice(0, 3);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAddToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ backgroundColor: "#FBF8F4", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E8E0D5", padding: "0.875rem 1.5rem" }}>
        <div className="max-w-[1440px] mx-auto flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "#888" }}>
          <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>Início</button>
          <span>›</span>
          <button onClick={() => navigate("catalog")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>Catálogo</button>
          <span>›</span>
          <span style={{ color: "#2C2C2C", fontWeight: 500 }}>{product.title.substring(0, 40)}…</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "5rem" }}>
          {/* Gallery */}
          <div>
            <div style={{ backgroundColor: "#F5F0EB", borderRadius: 4, overflow: "hidden", marginBottom: "1rem" }}>
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }}
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 80,
                    height: 80,
                    border: i === selectedImage ? "2px solid #C1522A" : "2px solid #E8E0D5",
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="technique-badge">{product.technique}</span>
              <span style={{ fontSize: "0.8125rem", color: "#888" }}>Região: {product.region}</span>
            </div>

            <h1
              className="font-display"
              style={{ fontSize: "2rem", fontWeight: 400, color: "#2C2C2C", lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: "1rem" }}
            >
              {product.title}
            </h1>

            <button
              onClick={() => navigate("artisan", product.artisanId)}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "pointer", marginBottom: "1.5rem", padding: 0 }}
            >
              <img
                src={artisan.avatar}
                alt={artisan.name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #C1522A" }}
              />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "0.8125rem", color: "#888", margin: 0 }}>Criado por</p>
                <p style={{ fontSize: "0.9375rem", color: "#C1522A", fontWeight: 600, margin: 0 }}>{artisan.name}</p>
              </div>
            </button>

            <div style={{ borderTop: "1px solid #E8E0D5", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.85 }}>{product.description}</p>
            </div>

            {/* Specs */}
            <div style={{ backgroundColor: "#F5F0EB", borderRadius: 4, padding: "1.25rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Técnica", value: product.technique },
                { label: "Região de Origem", value: `${product.region} · Pernambuco` },
                { label: "Artesão", value: artisan.name },
                { label: "Disponibilidade", value: product.stock > 0 ? `${product.stock} peças em estoque` : "Esgotado" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #E8E0D5" }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "#888", fontWeight: 500 }}>{spec.label}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#2C2C2C", fontWeight: 600 }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <div className="font-display" style={{ fontSize: "2.5rem", fontWeight: 600, color: "#C1522A", lineHeight: 1 }}>
                R$ {product.price.toFixed(2).replace(".", ",")}
              </div>
              {product.originalPrice && (
                <div style={{ fontSize: "1rem", color: "#aaa", textDecoration: "line-through", marginBottom: "0.25rem" }}>
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </div>
              )}
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="flex items-center"
                style={{ border: "1px solid #E8E0D5", borderRadius: 2, overflow: "hidden" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0EB", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#555" }}
                >
                  −
                </button>
                <div style={{ width: 48, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 600 }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0EB", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#555" }}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  backgroundColor: added ? "#2D6A4F" : "#C1522A",
                  color: "white",
                  border: "none",
                  borderRadius: 2,
                  padding: "0.875rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: product.stock === 0 ? "default" : "pointer",
                }}
              >
                {added ? "✓ Adicionado ao Carrinho" : "Adicionar ao Carrinho"}
              </button>
            </div>

            <button
              onClick={() => navigate("cart")}
              style={{
                width: "100%",
                backgroundColor: "#1B4332",
                color: "white",
                border: "none",
                borderRadius: 2,
                padding: "0.875rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Comprar Agora
            </button>

            <p style={{ fontSize: "0.75rem", color: "#aaa", textAlign: "center", marginTop: "1rem" }}>
              ★ Peça com certificado de autenticidade · Frete calculado no checkout
            </p>
          </div>
        </div>

        {/* Artisan bio card */}
        <div
          style={{
            backgroundColor: "#1B4332",
            borderRadius: 4,
            padding: "2.5rem",
            marginBottom: "4rem",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "2rem",
            alignItems: "center",
          }}
          className="flex-col md:flex-row"
        >
          <img
            src={artisan.avatar}
            alt={artisan.name}
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #C1522A", flexShrink: 0 }}
          />
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "0.5rem" }}>
              Sobre o Artesão
            </p>
            <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, color: "white", marginBottom: "0.75rem" }}>
              {artisan.name}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              {artisan.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {artisan.techniques.map((t) => (
                <span key={t} style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 2, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {t}
                </span>
              ))}
              <button
                onClick={() => navigate("artisan", artisan.id)}
                style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", backgroundColor: "#C1522A", color: "white", borderRadius: 2, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
              >
                Ver Perfil Completo →
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <p className="section-label mb-2">Você também pode gostar</p>
            <h2 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              Peças relacionadas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {related.map((p) => (
                <div key={p.id} className="card" style={{ cursor: "pointer" }} onClick={() => navigate("product", p.id)}>
                  <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "1rem" }}>
                    <span className="technique-badge">{p.technique}</span>
                    <h4 className="font-display" style={{ fontSize: "0.9375rem", fontWeight: 500, marginTop: "0.5rem", lineHeight: 1.4 }}>{p.title}</h4>
                    <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "#C1522A", marginTop: "0.5rem", fontFamily: "Fraunces, serif" }}>
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
