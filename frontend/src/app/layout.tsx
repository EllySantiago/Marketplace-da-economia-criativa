import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Origem | Artesanato pernambucano",
  description: "Marketplace de artesanato e economia criativa de Pernambuco.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
