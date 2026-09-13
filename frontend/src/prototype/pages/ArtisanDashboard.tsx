import { useState } from "react";
import { products } from "../data";

type DashSection = "overview" | "catalog" | "add" | "orders" | "stock";

const dashSections: { id: DashSection; label: string; icon: string }[] = [
  { id: "overview", label: "Visão Geral", icon: "▦" },
  { id: "catalog", label: "Meu Catálogo", icon: "⊞" },
  { id: "add", label: "Adicionar Produto", icon: "+" },
  { id: "orders", label: "Pedidos", icon: "📦" },
  { id: "stock", label: "Estoque", icon: "📋" },
];

const mockOrders = [
  { id: "#PE-4821", customer: "Carla Mendes", product: "Cangaceiro de Barro", date: "09/09/2026", status: "Enviado", total: "R$ 285,00" },
  { id: "#PE-4807", customer: "Bruno Ferreira", product: "Família de Bonecos", date: "07/09/2026", status: "Entregue", total: "R$ 195,00" },
  { id: "#PE-4793", customer: "Joana Lima", product: "Cangaceiro de Barro", date: "05/09/2026", status: "Processando", total: "R$ 285,00" },
  { id: "#PE-4781", customer: "Ricardo Nunes", product: "Família de Bonecos", date: "02/09/2026", status: "Entregue", total: "R$ 195,00" },
];

const statusColor = (status: string) => {
  if (status === "Entregue") return { bg: "#D8F3DC", color: "#1B4332" };
  if (status === "Enviado") return { bg: "#FEF3C7", color: "#92400E" };
  return { bg: "#F5F0EB", color: "#C1522A" };
};

export default function ArtisanDashboard() {
  const [activeSection, setActiveSection] = useState<DashSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const artisanProducts = products.filter((p) => p.artisanId === 1);

  const metrics = [
    { label: "Vendas Totais", value: "R$ 4.820,00", change: "+18% este mês", up: true },
    { label: "Produtos Ativos", value: "18", change: "3 baixo estoque", up: false },
    { label: "Pedidos Pendentes", value: "7", change: "2 aguardando envio", up: false },
    { label: "Avaliação Média", value: "4.9 ★", change: "42 avaliações", up: true },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {metrics.map((m) => (
                <div key={m.label} className="metric-card">
                  <p style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {m.label}
                  </p>
                  <div className="font-display" style={{ fontSize: "1.75rem", fontWeight: 600, color: "#2C2C2C", marginBottom: "0.25rem" }}>
                    {m.value}
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: m.up ? "#2D6A4F" : "#C1522A" }}>{m.change}</p>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E8E0D5" }}>
                <h3 className="font-display" style={{ fontSize: "1.125rem", fontWeight: 500 }}>Pedidos Recentes</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#FAFAFA" }}>
                  <tr>
                    {["Pedido", "Cliente", "Produto", "Data", "Status", "Total"].map((h) => (
                      <th key={h} className="table-row" style={{ padding: "0.75rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => {
                    const sc = statusColor(order.status);
                    return (
                      <tr key={order.id} className="table-row" style={{ borderBottom: "1px solid #E8E0D5" }}>
                        <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#C1522A", fontWeight: 600 }}>{order.id}</td>
                        <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{order.customer}</td>
                        <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{order.product}</td>
                        <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#888" }}>{order.date}</td>
                        <td style={{ padding: "1rem 0.75rem" }}>
                          <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "#2C2C2C" }}>{order.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "catalog":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {artisanProducts.map((product) => (
                <div key={product.id} style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
                  <img src={product.images[0]} alt={product.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  <div style={{ padding: "1rem" }}>
                    <span className="technique-badge">{product.technique}</span>
                    <h4 className="font-display" style={{ fontSize: "0.9375rem", fontWeight: 500, marginTop: "0.5rem", lineHeight: 1.4 }}>{product.title}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#C1522A", fontFamily: "Fraunces, serif" }}>R$ {product.price.toFixed(2).replace(".", ",")}</span>
                      <span style={{ fontSize: "0.75rem", color: product.stock > 2 ? "#2D6A4F" : "#C1522A", fontWeight: 600 }}>
                        {product.stock} em estoque
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button style={{ flex: 1, padding: "0.4rem", border: "1px solid #E8E0D5", borderRadius: 2, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", background: "white", color: "#555" }}>
                        Editar
                      </button>
                      <button style={{ flex: 1, padding: "0.4rem", border: "1px solid #fee2e2", borderRadius: 2, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", background: "#FFF5F5", color: "#dc2626" }}>
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "add":
        return (
          <div style={{ maxWidth: 640 }}>
            <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, padding: "2rem" }}>
              <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.5rem" }}>
                Novo Produto
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { label: "Título do Produto", placeholder: "Ex: Cangaceiro de Barro — Lampião e Maria Bonita", type: "text" },
                  { label: "Descrição", placeholder: "Descreva sua peça, técnica utilizada, materiais…", type: "textarea" },
                  { label: "Preço (R$)", placeholder: "0,00", type: "number" },
                  { label: "Quantidade em Estoque", placeholder: "0", type: "number" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        placeholder={field.placeholder}
                        rows={4}
                        style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #E8E0D5", borderRadius: 2, fontSize: "0.875rem", color: "#2C2C2C", resize: "vertical", backgroundColor: "#FAFAFA" }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #E8E0D5", borderRadius: 2, fontSize: "0.875rem", color: "#2C2C2C", backgroundColor: "#FAFAFA" }}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                    Técnica Artesanal
                  </label>
                  <select style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #E8E0D5", borderRadius: 2, fontSize: "0.875rem", color: "#2C2C2C", backgroundColor: "#FAFAFA" }}>
                    {["Cerâmica", "Renda Renascença", "Entalhamento em Madeira", "Couro Cru", "Bordado", "Escultura"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                    Fotos do Produto
                  </label>
                  <div style={{ border: "2px dashed #E8E0D5", borderRadius: 4, padding: "2rem", textAlign: "center", cursor: "pointer", backgroundColor: "#FAFAFA" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</div>
                    <p style={{ fontSize: "0.875rem", color: "#888" }}>Arraste fotos ou clique para selecionar</p>
                    <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.25rem" }}>JPG, PNG · máximo 5 fotos</p>
                  </div>
                </div>

                <button className="btn-primary" style={{ alignSelf: "flex-start" }}>
                  Publicar Produto
                </button>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#FAFAFA" }}>
                <tr>
                  {["Pedido", "Cliente", "Produto", "Data", "Status", "Total", "Ações"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", textAlign: "left", borderBottom: "1px solid #E8E0D5" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => {
                  const sc = statusColor(order.status);
                  return (
                    <tr key={order.id} style={{ borderBottom: "1px solid #E8E0D5" }}>
                      <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#C1522A", fontWeight: 600 }}>{order.id}</td>
                      <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{order.customer}</td>
                      <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{order.product}</td>
                      <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#888" }}>{order.date}</td>
                      <td style={{ padding: "1rem 0.75rem" }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2 }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 0.75rem", fontWeight: 600 }}>{order.total}</td>
                      <td style={{ padding: "1rem 0.75rem" }}>
                        <button style={{ fontSize: "0.75rem", color: "#C1522A", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Ver</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "stock":
        return (
          <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#FAFAFA" }}>
                <tr>
                  {["Produto", "Técnica", "Preço", "Estoque", "Status", "Ações"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", textAlign: "left", borderBottom: "1px solid #E8E0D5" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artisanProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid #E8E0D5" }}>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img src={product.images[0]} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 2 }} />
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#2C2C2C", maxWidth: 200 }}>{product.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}><span className="technique-badge">{product.technique}</span></td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "#C1522A" }}>R$ {product.price.toFixed(2).replace(".", ",")}</td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", fontWeight: 700 }}>{product.stock}</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <span style={{
                        backgroundColor: product.stock > 3 ? "#D8F3DC" : product.stock > 0 ? "#FEF3C7" : "#fee2e2",
                        color: product.stock > 3 ? "#1B4332" : product.stock > 0 ? "#92400E" : "#dc2626",
                        fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2
                      }}>
                        {product.stock > 3 ? "Normal" : product.stock > 0 ? "Baixo" : "Esgotado"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button style={{ fontSize: "0.75rem", color: "#555", background: "white", border: "1px solid #E8E0D5", borderRadius: 2, padding: "0.25rem 0.6rem", cursor: "pointer" }}>Editar</button>
                        <button style={{ fontSize: "0.75rem", color: "#dc2626", background: "#FFF5F5", border: "1px solid #fee2e2", borderRadius: 2, padding: "0.25rem 0.6rem", cursor: "pointer" }}>Remover</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  const sectionTitles: Record<DashSection, string> = {
    overview: "Visão Geral",
    catalog: "Meu Catálogo",
    add: "Adicionar Produto",
    orders: "Pedidos",
    stock: "Gestão de Estoque",
  };

  return (
    <div style={{ backgroundColor: "#F5F0EB", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div
        className="hide-mobile"
        style={{
          width: 240,
          backgroundColor: "#1B4332",
          flexShrink: 0,
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          minHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "0.5rem" }}>
            Painel do Artesão
          </p>
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "white" }}>Maria das Graças</p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>Caruaru · Agreste</p>
        </div>

        {dashSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`sidebar-nav-item ${activeSection === s.id ? "active" : ""}`}
          >
            <span style={{ fontSize: "1rem" }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Mobile header */}
      <div className="show-mobile" style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#1B4332", display: "flex", zIndex: 50, padding: "0.5rem" }}>
        {dashSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}
          >
            <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
            <span style={{ fontSize: "0.6rem", color: activeSection === s.id ? "#C1522A" : "rgba(255,255,255,0.5)" }}>{s.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", minWidth: 0 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="section-label mb-1">Painel do Artesão</p>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.02em" }}>
            {sectionTitles[activeSection]}
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
