import { type CartItem, type Page } from "../data";

interface CartProps {
  cartItems: CartItem[];
  navigate: (page: Page) => void;
  onUpdateQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
}

export default function Cart({ cartItems, navigate, onUpdateQty, onRemove }: CartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 400 ? 0 : 35.9;
  const total = subtotal + shipping;

  return (
    <div style={{ backgroundColor: "#FBF8F4", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E8E0D5", padding: "1.25rem 1.5rem" }}>
        <div className="max-w-[1440px] mx-auto flex items-center gap-3">
          <button onClick={() => navigate("catalog")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "0.875rem" }}>
            ← Continuar Comprando
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <p className="section-label mb-2">Meu Carrinho</p>
        <h1 className="font-display" style={{ fontSize: "2rem", fontWeight: 400, letterSpacing: "-0.025em", marginBottom: "2rem" }}>
          {cartItems.length === 0 ? "Seu carrinho está vazio" : `${cartItems.reduce((s, i) => s + i.quantity, 0)} itens selecionados`}
        </h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <p className="font-display" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Nenhum item no carrinho ainda.</p>
            <button className="btn-primary" onClick={() => navigate("catalog")}>Explorar Catálogo</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2.5rem", alignItems: "start" }}>
            {/* Items */}
            <div>
              <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, overflow: "hidden" }}>
                {cartItems.map((item, idx) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "1.25rem",
                      padding: "1.5rem",
                      alignItems: "center",
                      borderBottom: idx < cartItems.length - 1 ? "1px solid #E8E0D5" : "none",
                    }}
                  >
                    {/* Image */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 4, cursor: "pointer", flexShrink: 0 }}
                      onClick={() => navigate("catalog")}
                    />

                    {/* Info */}
                    <div>
                      <span className="technique-badge" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
                        {item.product.technique}
                      </span>
                      <h3 className="font-display" style={{ fontSize: "1rem", fontWeight: 500, color: "#2C2C2C", lineHeight: 1.4, marginBottom: "0.25rem" }}>
                        {item.product.title}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "#888", marginBottom: "0.75rem" }}>
                        por {item.product.artisanName}
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "#555" }}>
                        Unitário: <strong style={{ color: "#C1522A" }}>R$ {item.product.price.toFixed(2).replace(".", ",")}</strong>
                      </p>
                    </div>

                    {/* Qty + total + delete */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1rem", lineHeight: 1 }}
                      >
                        ✕
                      </button>

                      <div
                        className="flex items-center"
                        style={{ border: "1px solid #E8E0D5", borderRadius: 2, overflow: "hidden" }}
                      >
                        <button
                          onClick={() => item.quantity > 1 ? onUpdateQty(item.product.id, item.quantity - 1) : onRemove(item.product.id)}
                          style={{ width: 34, height: 34, background: "#F5F0EB", border: "none", cursor: "pointer", fontSize: "1rem", color: "#555" }}
                        >
                          −
                        </button>
                        <div style={{ width: 40, textAlign: "center", fontSize: "0.9375rem", fontWeight: 600 }}>
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          style={{ width: 34, height: 34, background: "#F5F0EB", border: "none", cursor: "pointer", fontSize: "1rem", color: "#555" }}
                        >
                          +
                        </button>
                      </div>

                      <div className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600, color: "#C1522A" }}>
                        R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div style={{ width: 340, flexShrink: 0 }}>
              <div style={{ backgroundColor: "white", border: "1px solid #E8E0D5", borderRadius: 4, padding: "1.75rem", position: "sticky", top: 90 }}>
                <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                  Resumo do Pedido
                </h2>

                {[
                  { label: "Subtotal", value: `R$ ${subtotal.toFixed(2).replace(".", ",")}` },
                  { label: "Frete estimado", value: shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}` },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #E8E0D5", fontSize: "0.9rem", color: "#555" }}>
                    <span>{row.label}</span>
                    <span style={{ fontWeight: 600, color: row.value === "Grátis" ? "#2D6A4F" : "#2C2C2C" }}>{row.value}</span>
                  </div>
                ))}

                {shipping > 0 && (
                  <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.5rem" }}>
                    Frete grátis em pedidos acima de R$ 400,00
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", marginTop: "0.5rem" }}>
                  <span className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600 }}>Total</span>
                  <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#C1522A" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <button
                  onClick={() => navigate("confirmation")}
                  style={{
                    width: "100%",
                    backgroundColor: "#C1522A",
                    color: "white",
                    border: "none",
                    borderRadius: 2,
                    padding: "1rem",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginBottom: "0.75rem",
                  }}
                >
                  Finalizar Pedido →
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  {["🔒 Pagamento seguro", "🎁 Embalagem artesanal", "📦 Entrega rastreada"].map((item) => (
                    <div key={item} style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
