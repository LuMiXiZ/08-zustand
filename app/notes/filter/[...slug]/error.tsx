"use client";

type Props = {
  error: Error;
};

export default function NotesError({ error }: Props) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
    </div>
  );
}
