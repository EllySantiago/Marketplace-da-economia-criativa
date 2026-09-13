import PrototypeRoute from "../../../PrototypeRoute";

export default async function ArtesaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrototypeRoute initialPage="artisan" initialId={Number(id)} />;
}
