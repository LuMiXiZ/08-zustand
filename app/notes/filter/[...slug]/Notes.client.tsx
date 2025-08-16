"use client";

import css from "./NotesPage.module.css";
import { useState } from "react";
import { fetchNotes } from "../../../../lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import type { NoteSearchResponse } from "../../../../lib/api";
import Loading from "../../../loading";
import NotesError from "./error";
import Link from "next/link";

interface NotesClientProps {
  initialData: NoteSearchResponse;
  tag?: string;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search);
  }, 300);

  const searchQueryChange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () =>
      fetchNotes({ page, perPage: 12, search: debouncedSearch, tag }),
    enabled: true,
    placeholderData: keepPreviousData,
    initialData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={searchQueryChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {isLoading && <Loading />}
      {isError && <NotesError error={error} />}
      {isSuccess && data?.notes?.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
}
