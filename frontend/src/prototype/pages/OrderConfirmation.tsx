import { type Page, type CartItem } from "../data";

interface OrderConfirmationProps {
  navigate: (page: Page) => void;
  confirmedItems?: CartItem[];
}

const orderItems = [
  { title: "Cangaceiro de Barro — Lampião e Maria Bonita", artisan: "Maria das Graças Silva", technique: "Cerâmica", qty: 1, price: 285.0, img: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=120&h=120&fit=crop&auto=format" },
  { title: "Caminho de Mesa em Renda Renascença", artisan: "Ana Luíza Rodrigues", technique: "Renda", qty: 2, price: 380.0, img: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=120&h=120&fit=crop&auto=format" },
];

const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
const shipping = 35.9;
const total = subtotal + shipping;

const steps = [
  { label: "Pedido Confirmado", date: "12/09/2026", done: true },
  { label: "Preparando", date: "13/09/2026", done: false },
  { label: "Enviado pelos Correios", date: "14–15/09/2026", done: false },
  { label: "Entregue em Pernambuco", date: "17/09/2026", done: false },
];

export default function OrderConfirmation({ navigate }: OrderConfirmationProps) {
  return (
    <div style={{ backgroundColor: "#FBF8F4", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* Success mark */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: "#D8F3DC",
              border: "3px solid #2D6A4F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M10 21l8 8 13-14"
                stroke="#1B4332"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            className="section-label"
            style={{ color: "#2D6A4F", marginBottom: "0.75rem" }}
          >
            Pedido Realizado com Sucesso
          </p>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 400,
              color: "#2C2C2C",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
            }}
          >
            Pedido{" "}
            <span style={{ color: "#C1522A" }}>#PE-4821</span>{" "}
            realizado com sucesso!
          </h1>

          <p style={{ fontSize: "1rem", color: "#888", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Você receberá um e-mail de confirmação em <strong style={{ color: "#2C2C2C" }}>comprador@email.com.br</strong>. Acompanhe o status do pedido pelo painel.
          </p>
        </div>

        {/* Delivery timeline */}
        <div
          style={{
            backgroundColor: "#1B4332",
            borderRadius: 4,
            padding: "1.75rem 2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C1522A" }}>
              Prazo de Entrega — Pernambuco
            </p>
            <p className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600, color: "white" }}>
              Previsão: 17 de Setembro de 2026
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
            {/* progress line */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                right: 14,
                height: 2,
                backgroundColor: "rgba(255,255,255,0.15)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                width: "8%",
                height: 2,
                backgroundColor: "#C1522A",
                zIndex: 0,
              }}
            />

            {steps.map((step, idx) => (
              <div
                key={step.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: step.done ? "#C1522A" : "rgba(255,255,255,0.12)",
                    border: step.done ? "2px solid #C1522A" : "2px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  {step.done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.3)", display: "block" }} />
                  )}
                </div>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: step.done ? "white" : "rgba(255,255,255,0.5)", lineHeight: 1.3, marginBottom: "0.3rem" }}>
                  {step.label}
                </p>
                <p style={{ fontSize: "0.7rem", color: step.done ? "#C1522A" : "rgba(255,255,255,0.3)" }}>
                  {step.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E8E0D5",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #E8E0D5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="font-display" style={{ fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.015em" }}>
              Resumo do Pedido
            </h2>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2D6A4F",
                backgroundColor: "#D8F3DC",
                padding: "0.25rem 0.625rem",
                borderRadius: 2,
              }}
            >
              #PE-4821
            </span>
          </div>

          {/* Items */}
          {orderItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                alignItems: "center",
                borderBottom: idx < orderItems.length - 1 ? "1px solid #F0EAE2" : "none",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 4,
                  overflow: "hidden",
                  backgroundColor: "#F5F0EB",
                  flexShrink: 0,
                }}
              >
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <span className="technique-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
                  {item.technique}
                </span>
                <p className="font-display" style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#2C2C2C", lineHeight: 1.4, marginBottom: "0.2rem" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#888" }}>por {item.artisan} · Qtd: {item.qty}</p>
              </div>
              <div className="font-display" style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#C1522A", textAlign: "right", flexShrink: 0 }}>
                R$ {(item.price * item.qty).toFixed(2).replace(".", ",")}
              </div>
            </div>
          ))}

          {/* Totals */}
          <div style={{ backgroundColor: "#FAFAFA", borderTop: "1px solid #E8E0D5", padding: "1.25rem 1.5rem" }}>
            {[
              { label: "Subtotal", value: `R$ ${subtotal.toFixed(2).replace(".", ",")}` },
              { label: "Frete (Pernambuco)", value: `R$ ${shipping.toFixed(2).replace(".", ",")}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "0.875rem",
                borderTop: "1px solid #E8E0D5",
                marginTop: "0.5rem",
              }}
            >
              <span className="font-display" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>Total Pago</span>
              <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#C1522A" }}>
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address card */}
        <div
          style={{
            backgroundColor: "#F5F0EB",
            border: "1px solid #E8E0D5",
            borderRadius: 4,
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
              Endereço de Entrega
            </p>
            <p style={{ fontSize: "0.9rem", color: "#2C2C2C", fontWeight: 600, marginBottom: "0.2rem" }}>Carla Mendes da Silva</p>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.7 }}>
              Rua das Graviolas, 142 — Boa Vista<br />
              Recife, PE · CEP 50.060-140
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
              Pagamento
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <div style={{ width: 32, height: 20, backgroundColor: "#1B4332", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.55rem", color: "white", fontWeight: 700 }}>VISA</span>
              </div>
              <span style={{ fontSize: "0.9rem", color: "#2C2C2C", fontWeight: 600 }}>•••• •••• •••• 4729</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#555" }}>Parcelado em 3× sem juros</p>
          </div>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { icon: "🔒", label: "Compra Segura" },
            { icon: "🎁", label: "Embalagem Artesanal" },
            { icon: "📦", label: "Entrega Rastreada" },
            { icon: "✅", label: "Autenticidade Garantida" },
          ].map((b) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "#888" }}>
              <span style={{ fontSize: "1rem" }}>{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("home")}
            style={{
              backgroundColor: "#C1522A",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "0.9375rem 2.5rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Voltar para a Vitrine
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => navigate("dashboard")}
            style={{
              backgroundColor: "transparent",
              color: "#1B4332",
              border: "1.5px solid #1B4332",
              borderRadius: 4,
              padding: "0.9375rem 2rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Ver Meus Pedidos
          </button>
        </div>
      </div>
    </div>
  );
}
