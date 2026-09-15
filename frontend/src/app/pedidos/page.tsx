"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/hooks/useAuth";
import { usePedidos } from "@/hooks/usePedidos";
import OrderCard from "@/components/pedido/OrderCard";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import { ROTAS } from "@/constants/rotas";

function ListaDePedidos({ email }: { email: string }) {
  const { pedidos, carregando, erro, recarregar } = usePedidos({ tipo: "cliente", email });

  if (carregando) return <LoadingState variante="lista" itens={3} mensagem="Carregando pedidos..." />;
  if (erro) return <ErrorState mensagem={erro} onTentarNovamente={recarregar} />;
  if (pedidos.length === 0) {
    return <EmptyState titulo="Você ainda não fez nenhum pedido" acaoHref={ROTAS.produtos} acaoLabel="Explorar catálogo" />;
  }
  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <OrderCard key={pedido.codigo} pedido={pedido} />
      ))}
    </div>
  );
}

export default function PedidosPage() {
  const { usuario, estaAutenticado } = useAuth();

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[900px] px-6 py-12 md:px-12">
        <p className="section-label">Minha conta</p>
        <h1 className="mt-2 font-display text-4xl text-[#2C2C2C]">Meus pedidos</h1>
        <div className="mt-8">
          {estaAutenticado && usuario ? <ListaDePedidos email={usuario.email} /> : <EmptyState titulo="Entre para ver seus pedidos" acaoHref={ROTAS.login} acaoLabel="Entrar" />}
        </div>
      </main>
    </PublicLayout>
  );
}
