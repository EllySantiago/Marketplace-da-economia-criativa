import PrototypeRoute from "../../../PrototypeRoute";

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrototypeRoute initialPage="product" initialId={Number(id)} />;
}
