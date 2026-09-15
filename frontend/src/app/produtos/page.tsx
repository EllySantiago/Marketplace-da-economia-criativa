import { Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import CatalogView from "@/components/produto/CatalogView";
import LoadingState from "@/components/feedback/LoadingState";

export default function ProdutosPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="mx-auto max-w-[1440px] px-6 py-12"><LoadingState variante="grid" itens={6} /></div>}>
        <CatalogView />
      </Suspense>
    </PublicLayout>
  );
}
