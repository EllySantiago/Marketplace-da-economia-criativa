"use client";

import { useState } from "react";
import type { CartItem, Page } from "./prototype/data";
import { initialCart, products } from "./prototype/data";
import Header from "./prototype/components/Header";
import Footer from "./prototype/components/Footer";
import Home from "./prototype/pages/Home";
import Catalog from "./prototype/pages/Catalog";
import ProductDetail from "./prototype/pages/ProductDetail";
import ArtisanProfile from "./prototype/pages/ArtisanProfile";
import Cart from "./prototype/pages/Cart";
import ArtisanDashboard from "./prototype/pages/ArtisanDashboard";
import AdminPanel from "./prototype/pages/AdminPanel";
import LoginRegister from "./prototype/pages/LoginRegister";
import OrderConfirmation from "./prototype/pages/OrderConfirmation";

interface PrototypeRouteProps {
  initialPage: Page;
  initialId?: number;
}

export default function PrototypeRoute({ initialPage, initialId = 1 }: PrototypeRouteProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [selectedProductId, setSelectedProductId] = useState(initialPage === "product" ? initialId : 1);
  const [selectedArtisanId, setSelectedArtisanId] = useState(initialPage === "artisan" ? initialId : 1);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [searchQuery, setSearchQuery] = useState("");

  function navigate(page: Page, id?: number) {
    if (page === "product" && id !== undefined) setSelectedProductId(id);
    if (page === "artisan" && id !== undefined) setSelectedArtisanId(id);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(productId: number, quantity = 1) {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.product.id === productId);
      if (existing) return previous.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item);
      const product = products.find((item) => item.id === productId);
      return product ? [...previous, { product, quantity }] : previous;
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    setCartItems((previous) => previous.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  }

  function removeFromCart(productId: number) {
    setCartItems((previous) => previous.filter((item) => item.product.id !== productId));
  }

  const dashboardPage = currentPage === "dashboard" || currentPage === "admin" || currentPage === "login";
  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {!dashboardPage && <Header currentPage={currentPage} navigate={navigate} cartItems={cartItems} onSearch={setSearchQuery} />}
    <main style={{ flex: 1 }}>
      {currentPage === "home" && <Home navigate={navigate} onAddToCart={(id) => addToCart(id)} />}
      {currentPage === "catalog" && <Catalog navigate={navigate} onAddToCart={(id) => addToCart(id)} searchQuery={searchQuery} />}
      {currentPage === "product" && <ProductDetail productId={selectedProductId} navigate={navigate} onAddToCart={addToCart} />}
      {currentPage === "artisan" && <ArtisanProfile artisanId={selectedArtisanId} navigate={navigate} onAddToCart={(id) => addToCart(id)} />}
      {currentPage === "cart" && <Cart cartItems={cartItems} navigate={navigate} onUpdateQty={updateQuantity} onRemove={removeFromCart} />}
      {currentPage === "dashboard" && <ArtisanDashboard />}
      {currentPage === "admin" && <AdminPanel />}
      {currentPage === "login" && <LoginRegister navigate={navigate} />}
      {currentPage === "confirmation" && <OrderConfirmation navigate={navigate} />}
    </main>
    {!dashboardPage && <Footer />}
  </div>;
}
