import { getOwnNotes } from '@/server/actions/notes';

export async function NotesList() {
  const notes = await getOwnNotes();
  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>{note.id}</div>
      ))}
    </div>
  );
}
