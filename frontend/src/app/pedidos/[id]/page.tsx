import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import OrderDetails from "@/components/pedido/OrderDetails";
import { ROTAS } from "@/constants/rotas";

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PublicLayout>
      <main className="mx-auto max-w-[900px] px-6 py-12 md:px-12">
        <Link href={ROTAS.pedidos} className="text-sm text-[#888] hover:text-[#C1522A]">
          ← Meus pedidos
        </Link>
        <div className="mt-8">
          <OrderDetails codigo={decodeURIComponent(id)} />
        </div>
      </main>
    </PublicLayout>
  );
}
