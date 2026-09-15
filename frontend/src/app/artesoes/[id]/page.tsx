import PublicLayout from "@/components/layout/PublicLayout";
import ArtisanProfile from "@/components/artesao/ArtisanProfile";

export default async function ArtesaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PublicLayout>
      <ArtisanProfile artesaoId={Number(id)} />
    </PublicLayout>
  );
}
