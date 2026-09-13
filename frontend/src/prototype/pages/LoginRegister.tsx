import { useState } from "react";
import type { Page } from "../data";

type Role = "comprador" | "artesao" | "admin";
type AuthTab = "login" | "register";

interface LoginRegisterProps {
  navigate: (page: Page) => void;
}

const roles: { id: Role; label: string; icon: string; desc: string }[] = [
  { id: "comprador", label: "Comprador", icon: "🛍️", desc: "Explore e adquira peças únicas" },
  { id: "artesao", label: "Artesão", icon: "🧑‍🎨", desc: "Publique e venda suas criações" },
  { id: "admin", label: "Administrador", icon: "⚙️", desc: "Gerencie a plataforma" },
];

export default function LoginRegister({ navigate }: LoginRegisterProps) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [role, setRole] = useState<Role>("comprador");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "admin") navigate("admin");
    else if (role === "artesao") navigate("dashboard");
    else navigate("home");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        backgroundColor: "#FBF8F4",
      }}
      className="auth-grid"
    >
      {/* Left panel — decorative */}
      <div
        className="hide-mobile"
        style={{
          position: "relative",
          backgroundColor: "#1B4332",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "3rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=900&h=1200&fit=crop&auto=format)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(175deg, rgba(27,67,50,0.6) 0%, rgba(27,67,50,0.97) 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{ position: "absolute", top: "2.5rem", left: "3rem", display: "flex", alignItems: "center", gap: "0.6rem", zIndex: 1 }}
        >
          <div
            style={{ width: 32, height: 32, backgroundColor: "#C1522A", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: "white", letterSpacing: "-0.02em" }}>
            Origem
          </span>
        </div>

        {/* Pull quotes */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            className="font-display"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 400, color: "white", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: "1.25rem" }}
          >
            "Cada peça carrega<br />
            <em style={{ color: "#C1522A", fontStyle: "italic" }}>gerações de saber."</em>
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 380 }}>
            Conectando o artesanato autêntico de Pernambuco com quem entende o valor do feito à mão desde 2024.
          </p>

          {/* Artisan card */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              padding: "1.25rem",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              maxWidth: 380,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=80&h=80&fit=crop&auto=format"
              alt="Maria das Graças"
              style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #C1522A", flexShrink: 0 }}
            />
            <div>
              <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "white" }}>Maria das Graças Silva</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Caruaru · Cerâmica · Artesã desde 1993</p>
              <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.4rem" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#C1522A", fontSize: "0.75rem" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 4rem",
          overflowY: "auto",
        }}
        className="auth-form-panel"
      >
        {/* Mobile logo */}
        <div className="show-mobile" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2rem" }}>
          <div style={{ width: 28, height: 28, backgroundColor: "#C1522A", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}>Origem</span>
        </div>

        <div style={{ maxWidth: 420, width: "100%" }}>
          {/* Auth tab switcher */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "#F5F0EB",
              borderRadius: 4,
              padding: 4,
              marginBottom: "2rem",
            }}
          >
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: 2,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  backgroundColor: tab === t ? "white" : "transparent",
                  color: tab === t ? "#2C2C2C" : "#888",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {t === "login" ? "Entrar" : "Criar Conta"}
              </button>
            ))}
          </div>

          <h1
            className="font-display"
            style={{ fontSize: "2rem", fontWeight: 400, color: "#2C2C2C", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}
          >
            {tab === "login" ? "Bem-vindo de volta." : "Crie sua conta."}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "2rem", lineHeight: 1.6 }}>
            {tab === "login"
              ? "Acesse sua conta para continuar explorando o artesanato pernambucano."
              : "Junte-se ao Origem e conecte-se com a cultura autêntica de Pernambuco."}
          </p>

          {/* Role selector */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
              Tipo de conta
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    padding: "0.875rem 0.5rem",
                    borderRadius: 4,
                    border: role === r.id ? "2px solid #C1522A" : "1.5px solid #E8E0D5",
                    backgroundColor: role === r.id ? "#FFF7F4" : "white",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "all 150ms ease",
                  }}
                >
                  <span style={{ fontSize: "1.375rem" }}>{r.icon}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: role === r.id ? "#C1522A" : "#555",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.5rem" }}>
              {roles.find((r) => r.id === role)?.desc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {tab === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #E8E0D5",
                    borderRadius: 4,
                    fontSize: "0.9375rem",
                    color: "#2C2C2C",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com.br"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid #E8E0D5",
                  borderRadius: 4,
                  fontSize: "0.9375rem",
                  color: "#2C2C2C",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#555" }}>Senha</label>
                {tab === "login" && (
                  <button type="button" style={{ fontSize: "0.8rem", color: "#C1522A", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.75rem 0.75rem 1rem",
                    border: "1.5px solid #E8E0D5",
                    borderRadius: 4,
                    fontSize: "0.9375rem",
                    color: "#2C2C2C",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "0.9rem" }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>
                  Confirmar Senha
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.75rem 0.75rem 1rem",
                      border: "1.5px solid #E8E0D5",
                      borderRadius: 4,
                      fontSize: "0.9375rem",
                      color: "#2C2C2C",
                      backgroundColor: "white",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "0.9rem" }}
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            )}

            {tab === "register" && role === "artesao" && (
              <div
                style={{
                  backgroundColor: "#F5F0EB",
                  border: "1px solid #E8E0D5",
                  borderRadius: 4,
                  padding: "1rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📋</span>
                <p style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.6 }}>
                  Artesãos passam por um processo de verificação. Você receberá um e-mail em até 48 horas após o cadastro.
                </p>
              </div>
            )}

            {tab === "register" && (
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer" }}>
                <input type="checkbox" required style={{ accentColor: "#C1522A", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.6 }}>
                  Concordo com os{" "}
                  <span style={{ color: "#C1522A", fontWeight: 600, cursor: "pointer" }}>Termos de Uso</span>{" "}
                  e a{" "}
                  <span style={{ color: "#C1522A", fontWeight: 600, cursor: "pointer" }}>Política de Privacidade</span>{" "}
                  do Origem.
                </span>
              </label>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#C1522A",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "0.9375rem",
                fontSize: "0.9375rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: "0.25rem",
              }}
            >
              {tab === "login" ? "Entrar na Plataforma" : "Criar Minha Conta"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#E8E0D5" }} />
            <span style={{ fontSize: "0.75rem", color: "#aaa", fontWeight: 500 }}>ou continue com</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#E8E0D5" }} />
          </div>

          {/* Social */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { label: "Google", icon: "G" },
              { label: "Facebook", icon: "f" },
            ].map((s) => (
              <button
                key={s.label}
                style={{
                  padding: "0.75rem",
                  border: "1.5px solid #E8E0D5",
                  borderRadius: 4,
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: s.label === "Google" ? "#EA4335" : "#1877F2",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888", marginTop: "1.75rem" }}>
            {tab === "login" ? "Ainda não tem conta? " : "Já tem uma conta? "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              style={{ color: "#C1522A", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
            >
              {tab === "login" ? "Criar agora" : "Entrar"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-form-panel { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
