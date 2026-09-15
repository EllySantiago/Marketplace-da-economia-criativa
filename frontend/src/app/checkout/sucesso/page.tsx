import { Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import OrderConfirmation from "@/components/pedido/OrderConfirmation";
import LoadingState from "@/components/feedback/LoadingState";

export default function CheckoutSucessoPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="mx-auto max-w-[760px] px-6 py-16"><LoadingState variante="texto" /></div>}>
        <OrderConfirmation />
      </Suspense>
    </PublicLayout>
  );
}
