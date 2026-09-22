import { useState } from "react";
import type { Page } from "../data";
import type { CartItem } from "../data";

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  cartItems: CartItem[];
  onSearch?: (query: string) => void;
}

export default function Header({ currentPage, navigate, cartItems, onSearch }: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Vitrine", page: "home" },
    { label: "Catálogo", page: "catalog" },
    { label: "Artesãos", page: "artisan" },
    { label: "Painel", page: "dashboard" },
    { label: "Admin", page: "admin" },
  ];

  return (
    <header style={{ backgroundColor: "#FBF8F4", borderBottom: "1px solid #E8E0D5" }} className="sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center gap-6" style={{ height: 68 }}>
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 shrink-0"
        >
          <div
            style={{ width: 32, height: 32, backgroundColor: "#C1522A", borderRadius: 2 }}
            className="flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold" style={{ color: "#2C2C2C", letterSpacing: "-0.02em" }}>
            Origem
          </span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md hide-mobile">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ color: "#888" }}
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar peças, artesãos, técnicas…"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch?.(e.target.value);
              }}
              style={{
                width: "100%",
                paddingLeft: "2.25rem",
                paddingRight: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                backgroundColor: "#F5F0EB",
                border: "1px solid #E8E0D5",
                borderRadius: 2,
                fontSize: "0.875rem",
                color: "#2C2C2C",
              }}
            />
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-5 hide-mobile">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`nav-link ${currentPage === link.page ? "active" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {/* Cart */}
          <button
            onClick={() => navigate("cart")}
            className="relative flex items-center justify-center"
            style={{ width: 40, height: 40 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#2C2C2C" }}>
              <path d="M3 3h2l.4 2M7 13h10l2-7H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 16,
                  height: 16,
                  backgroundColor: "#C1522A",
                  borderRadius: "50%",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("login")}
            className="flex items-center gap-2 hide-mobile"
            style={{
              padding: "0.4rem 1rem",
              backgroundColor: "#1B4332",
              color: "white",
              borderRadius: 2,
              fontSize: "0.8125rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="3" stroke="white" strokeWidth="1.4" />
              <path d="M1 13c0-3 2.5-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Entrar
          </button>

          {/* Mobile menu toggle */}
          <button
            className="show-mobile flex items-center justify-center"
            style={{ width: 40, height: 40 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="show-mobile"
          style={{
            backgroundColor: "#FBF8F4",
            borderTop: "1px solid #E8E0D5",
            padding: "1rem 1.5rem",
          }}
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Buscar…"
              style={{
                padding: "0.625rem 1rem",
                backgroundColor: "#F5F0EB",
                border: "1px solid #E8E0D5",
                borderRadius: 2,
                fontSize: "0.875rem",
                width: "100%",
              }}
            />
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { navigate(link.page); setMobileMenuOpen(false); }}
                style={{
                  textAlign: "left",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: currentPage === link.page ? "#C1522A" : "#2C2C2C",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #E8E0D5",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
