"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";

type NotePreviewProps = {
  id: string;
};

export default function NotePreviewClient({ id }: NotePreviewProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      {!isLoading && !isError && note && (
        <div className={css.container}>
          <div className={css.item}>
            <button onClick={handleClose} className={css.backBtn}>
              Go Back
            </button>
            <div className={css.header}>
              <h2>{note?.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            {note.tag && (
              <p className={css.tag}>
                <strong>Tag:</strong> {note.tag}
              </p>
            )}
            <p className={css.date}>
              {note.updatedAt === note.createdAt
                ? `Created at: ${new Date(note.createdAt).toLocaleString(
                    "uk-UA"
                  )}`
                : `Updated at: ${new Date(note.updatedAt).toLocaleString(
                    "uk-UA"
                  )}`}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
