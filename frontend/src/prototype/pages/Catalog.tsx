import { useState } from "react";
import { products, type Page } from "../data";

interface CatalogProps {
  navigate: (page: Page, id?: number) => void;
  onAddToCart: (productId: number) => void;
  searchQuery?: string;
}

const regions = ["Agreste", "Sertão", "Zona da Mata", "RMR"];
const techniques = ["Cerâmica", "Renda Renascença", "Entalhamento em Madeira", "Couro Cru", "Bordado", "Escultura"];

export default function Catalog({ navigate, onAddToCart, searchQuery = "" }: CatalogProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleRegion(r: string) {
    setSelectedRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }
  function toggleTechnique(t: string) {
    setSelectedTechniques((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  let filtered = products.filter((p) => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.artisanName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRegions.length && !selectedRegions.includes(p.region)) return false;
    if (selectedTechniques.length && !selectedTechniques.some((t) => p.technique.includes(t) || t.includes(p.technique))) return false;
    if (p.price > priceMax) return false;
    if (inStockOnly && p.stock === 0) return false;
    return true;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  function handleAdd(id: number) {
    onAddToCart(id);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  }

  const Sidebar = () => (
    <div style={{ minWidth: 240 }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          Região de Pernambuco
        </p>
        {regions.map((r) => (
          <label key={r} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={selectedRegions.includes(r)}
              onChange={() => toggleRegion(r)}
              style={{ accentColor: "#C1522A", width: 15, height: 15 }}
            />
            <span style={{ fontSize: "0.875rem", color: "#555" }}>{r}</span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          Técnica Artesanal
        </p>
        {techniques.map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={selectedTechniques.includes(t)}
              onChange={() => toggleTechnique(t)}
              style={{ accentColor: "#C1522A", width: 15, height: 15 }}
            />
            <span style={{ fontSize: "0.875rem", color: "#555" }}>{t}</span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          Preço Máximo — R$ {priceMax}
        </p>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#C1522A" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#aaa", marginTop: "0.25rem" }}>
          <span>R$ 50</span>
          <span>R$ 1.000</span>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
          Disponibilidade
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ accentColor: "#C1522A", width: 15, height: 15 }}
          />
          <span style={{ fontSize: "0.875rem", color: "#555" }}>Somente em estoque</span>
        </label>
      </div>

      <button
        onClick={() => { setSelectedRegions([]); setSelectedTechniques([]); setPriceMax(1000); setInStockOnly(false); }}
        style={{ fontSize: "0.8125rem", color: "#C1522A", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
      >
        Limpar filtros
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#FBF8F4", minHeight: "100vh" }}>
      {/* Header bar */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E8E0D5", padding: "1rem 1.5rem" }}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="section-label">Catálogo</p>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, letterSpacing: "-0.02em" }}>
              {filtered.length} peças encontradas
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="show-mobile btn-outline"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Filtros
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #E8E0D5",
                borderRadius: 2,
                fontSize: "0.875rem",
                color: "#555",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="featured">Destaque</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {/* Sidebar desktop */}
          <div className="hide-mobile" style={{ flexShrink: 0, width: 240, paddingTop: "0.25rem" }}>
            <Sidebar />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="show-mobile"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
              onClick={() => setSidebarOpen(false)}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 280,
                  backgroundColor: "white",
                  padding: "1.5rem",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0", color: "#888" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪴</div>
                <p className="font-display" style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#2C2C2C" }}>
                  Nenhuma peça encontrada
                </p>
                <p style={{ fontSize: "0.9rem" }}>Tente ajustar os filtros</p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {filtered.map((product) => (
                  <div key={product.id} className="card group">
                    <div
                      style={{ position: "relative", overflow: "hidden", backgroundColor: "#F5F0EB", cursor: "pointer" }}
                      onClick={() => navigate("product", product.id)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: product.stock > 0 ? "#D8F3DC" : "#fee2e2",
                          color: product.stock > 0 ? "#1B4332" : "#dc2626",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          padding: "0.2rem 0.5rem",
                          borderRadius: 2,
                        }}
                      >
                        {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                      </div>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="technique-badge">{product.technique}</span>
                        <span style={{ fontSize: "0.7rem", color: "#aaa" }}>{product.region}</span>
                      </div>
                      <h3
                        className="font-display"
                        style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#2C2C2C", marginBottom: "0.3rem", lineHeight: 1.4, cursor: "pointer" }}
                        onClick={() => navigate("product", product.id)}
                      >
                        {product.title}
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "0.75rem" }}>por {product.artisanName}</p>
                      <div className="flex items-center justify-between">
                        <div className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600, color: "#C1522A" }}>
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </div>
                        <button
                          disabled={product.stock === 0}
                          onClick={() => handleAdd(product.id)}
                          style={{
                            backgroundColor: addedId === product.id ? "#2D6A4F" : product.stock === 0 ? "#E8E0D5" : "#C1522A",
                            color: product.stock === 0 ? "#aaa" : "white",
                            border: "none",
                            borderRadius: 2,
                            padding: "0.4rem 0.875rem",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            cursor: product.stock === 0 ? "default" : "pointer",
                          }}
                        >
                          {addedId === product.id ? "✓ OK" : product.stock === 0 ? "Esgotado" : "+ Carrinho"}
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
