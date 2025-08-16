import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.length ? resolvedParams.slug[0] : undefined;

  const initialData =
    tag && tag !== "All"
      ? await fetchNotes({ page: 1, perPage: 12, tag })
      : await fetchNotes({ page: 1, perPage: 12 });

  return <NotesClient initialData={initialData} tag={tag} />;
}
