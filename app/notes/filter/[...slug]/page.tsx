import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] ?? "All";

  const title = `Notes filtered by ${tag} | NoteHub`;
  const description = `Browse all notes filtered by "${tag}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-woad.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${tag}`,
        },
      ],
    },
  };
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
