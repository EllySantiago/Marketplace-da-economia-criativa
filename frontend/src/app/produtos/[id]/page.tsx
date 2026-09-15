import PublicLayout from "@/components/layout/PublicLayout";
import ProductDetails from "@/components/produto/ProductDetails";

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PublicLayout>
      <ProductDetails produtoId={Number(id)} />
    </PublicLayout>
  );
}
