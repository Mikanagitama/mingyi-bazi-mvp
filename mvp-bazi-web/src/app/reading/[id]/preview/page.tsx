import { redirect } from "next/navigation";

export default async function ReadingPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/reading/${id}`);
}
