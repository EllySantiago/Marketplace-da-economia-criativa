import { useState } from "react";
import { artisans } from "../data";

type AdminSection = "overview" | "artisans" | "products" | "activity";

const adminSections: { id: AdminSection; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "▦" },
  { id: "artisans", label: "Artesãos", icon: "👥" },
  { id: "products", label: "Produtos", icon: "🎨" },
  { id: "activity", label: "Atividade", icon: "📊" },
];

const pendingArtisans = [
  { id: 5, name: "Francisca Bezerra", region: "Sertão", city: "Serra Talhada", technique: "Bordado Richelieu", since: "2015", docs: "Completos" },
  { id: 6, name: "Antônio das Flores", region: "Agreste", city: "Bezerros", technique: "Xilogravura", since: "2008", docs: "Pendentes" },
  { id: 7, name: "Rosângela Mota", region: "Zona da Mata", city: "Vitória de Santo Antão", technique: "Cerâmica Decorativa", since: "2019", docs: "Completos" },
];

const activityLog = [
  { time: "09:42", action: "Novo produto cadastrado", actor: "Maria das Graças", type: "product" },
  { time: "09:15", action: "Artesão aprovado", actor: "Admin Sistema", type: "approval" },
  { time: "08:54", action: "Pedido #PE-4821 enviado", actor: "Sistema", type: "order" },
  { time: "08:30", action: "Nova solicitação de cadastro", actor: "Francisca Bezerra", type: "request" },
  { time: "Yesterday", action: "Produto editado: Oratório São Francisco", actor: "João Ferreira Neto", type: "product" },
  { time: "Yesterday", action: "Relatório mensal gerado", actor: "Admin Sistema", type: "report" },
];

const typeColors = {
  product: { bg: "#F5F0EB", color: "#C1522A" },
  approval: { bg: "#D8F3DC", color: "#1B4332" },
  order: { bg: "#EFF6FF", color: "#1e40af" },
  request: { bg: "#FEF3C7", color: "#92400E" },
  report: { bg: "#F5F0EB", color: "#555" },
};

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [approvalStatus, setApprovalStatus] = useState<Record<number, "pending" | "approved" | "rejected">>({
    5: "pending",
    6: "pending",
    7: "pending",
  });

  const metrics = [
    { label: "Total de Artesãos", value: "214", change: "+12 este mês", color: "#1B4332" },
    { label: "Produtos Publicados", value: "1.432", change: "+89 este mês", color: "#C1522A" },
    { label: "Pedidos no Período", value: "387", change: "↑ 23% vs. mês anterior", color: "#2D6A4F" },
    { label: "Receita da Plataforma", value: "R$ 48.640", change: "+18% vs. mês anterior", color: "#B8860B" },
    { label: "Aprovações Pendentes", value: "3", change: "Requerem ação", color: "#dc2626" },
    { label: "Ticket Médio", value: "R$ 342", change: "↑ 5% vs. mês anterior", color: "#555" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {metrics.map((m) => (
                <div key={m.label} className="metric-card">
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
                    {m.label}
                  </p>
                  <div className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: m.color, marginBottom: "0.25rem" }}>
                    {m.value}
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#888" }}>{m.change}</p>
                </div>
              ))}
            </div>

            {/* Pending approvals preview */}
            <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E8E0D5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="font-display" style={{ fontSize: "1.125rem", fontWeight: 500 }}>Aprovações Pendentes</h3>
                <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 999 }}>3 pendentes</span>
              </div>
              {pendingArtisans.map((artisan) => {
                const status = approvalStatus[artisan.id];
                return (
                  <div key={artisan.id} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #F0EAE2", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#F5F0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
                        🧑‍🎨
                      </div>
                      <div>
                        <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#2C2C2C" }}>{artisan.name}</p>
                        <p style={{ fontSize: "0.8125rem", color: "#888" }}>{artisan.city} · {artisan.region} · {artisan.technique}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2,
                        backgroundColor: artisan.docs === "Completos" ? "#D8F3DC" : "#FEF3C7",
                        color: artisan.docs === "Completos" ? "#1B4332" : "#92400E"
                      }}>
                        Docs: {artisan.docs}
                      </span>
                      {status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setApprovalStatus((prev) => ({ ...prev, [artisan.id]: "approved" }))}
                            style={{ padding: "0.375rem 0.875rem", backgroundColor: "#1B4332", color: "white", border: "none", borderRadius: 2, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => setApprovalStatus((prev) => ({ ...prev, [artisan.id]: "rejected" }))}
                            style={{ padding: "0.375rem 0.875rem", backgroundColor: "#FFF5F5", color: "#dc2626", border: "1px solid #fee2e2", borderRadius: 2, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <span style={{
                          fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 2,
                          backgroundColor: status === "approved" ? "#D8F3DC" : "#FFF5F5",
                          color: status === "approved" ? "#1B4332" : "#dc2626"
                        }}>
                          {status === "approved" ? "✓ Aprovado" : "✕ Rejeitado"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity log */}
            <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E8E0D5" }}>
                <h3 className="font-display" style={{ fontSize: "1.125rem", fontWeight: 500 }}>Atividade da Plataforma</h3>
              </div>
              {activityLog.map((log, idx) => {
                const tc = typeColors[log.type as keyof typeof typeColors] ?? typeColors.report;
                return (
                  <div key={idx} style={{ padding: "0.875rem 1.5rem", borderBottom: idx < activityLog.length - 1 ? "1px solid #F0EAE2" : "none", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#aaa", minWidth: 60 }}>{log.time}</span>
                    <span style={{ backgroundColor: tc.bg, color: tc.color, fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                      {log.type}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#555", flex: 1 }}>{log.action}</span>
                    <span style={{ fontSize: "0.8125rem", color: "#888" }}>{log.actor}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "artisans":
        return (
          <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#FAFAFA" }}>
                <tr>
                  {["Artesão", "Região", "Técnicas", "Peças", "Avaliação", "Status", "Ações"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", textAlign: "left", borderBottom: "1px solid #E8E0D5" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artisans.map((artisan) => (
                  <tr key={artisan.id} style={{ borderBottom: "1px solid #E8E0D5" }}>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img src={artisan.avatar} alt={artisan.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2C2C2C" }}>{artisan.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "#888" }}>{artisan.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{artisan.region}</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                        {artisan.techniques.slice(0, 1).map((t) => <span key={t} className="technique-badge">{t}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>{artisan.productsCount}</td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem" }}>★ {artisan.rating}</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <span style={{ backgroundColor: "#D8F3DC", color: "#1B4332", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2 }}>
                        Ativo
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button style={{ fontSize: "0.75rem", color: "#555", background: "white", border: "1px solid #E8E0D5", borderRadius: 2, padding: "0.25rem 0.6rem", cursor: "pointer" }}>Ver</button>
                        <button style={{ fontSize: "0.75rem", color: "#dc2626", background: "#FFF5F5", border: "1px solid #fee2e2", borderRadius: 2, padding: "0.25rem 0.6rem", cursor: "pointer" }}>Suspender</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingArtisans.map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #E8E0D5", opacity: 0.6 }}>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#F5F0EB", display: "flex", alignItems: "center", justifyContent: "center" }}>🧑</div>
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{a.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "#888" }}>{a.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem", color: "#555" }}>{a.region}</td>
                    <td style={{ padding: "1rem 0.75rem" }}><span className="technique-badge">{a.technique}</span></td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem" }}>—</td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem" }}>—</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <span style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 2 }}>
                        Pendente
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontSize: "0.75rem", color: "#C1522A", fontWeight: 600 }}>Revisar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div style={{ textAlign: "center", padding: "5rem", color: "#888" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚧</div>
            <p className="font-display" style={{ fontSize: "1.25rem", color: "#2C2C2C" }}>Seção em desenvolvimento</p>
          </div>
        );
    }
  };

  return (
    <div style={{ backgroundColor: "#F5F0EB", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div
        className="hide-mobile"
        style={{
          width: 240,
          backgroundColor: "#2C2C2C",
          flexShrink: 0,
          padding: "2rem 1rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A", marginBottom: "0.5rem" }}>
            Painel Administrativo
          </p>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "white" }}>Admin Origem</p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)" }}>admin@origem.com.br</p>
        </div>

        {adminSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: 4,
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              textAlign: "left",
              backgroundColor: activeSection === s.id ? "#C1522A" : "transparent",
              color: activeSection === s.id ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "2rem", minWidth: 0 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="section-label mb-1">Painel Administrativo</p>
          <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.02em" }}>
            {adminSections.find((s) => s.id === activeSection)?.label}
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
