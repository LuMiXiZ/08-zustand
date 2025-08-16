import { Note, NoteTag } from "@/types/note";
import axios from "axios";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const myApiToken = `Bearer ${token}`;
axios.defaults.headers.common["Authorization"] = myApiToken;

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (
  { page = 1, perPage = 12, search, tag }: FetchNotesParams = {
    page: 1,
    perPage: 12,
  }
): Promise<NoteSearchResponse> => {
  const params: FetchNotesParams = { page, perPage };
  if (search && search.trim() !== "") {
    params.search = search.trim();
  }
  if (tag && tag !== "All") {
    params.tag = tag.trim();
  }
  const response = await axios.get<NoteSearchResponse>(`/notes`, { params });
  return response.data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const response = await axios.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};
