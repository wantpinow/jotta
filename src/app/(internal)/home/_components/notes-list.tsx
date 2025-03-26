import { NoteCard, NoteCardSkeleton } from '@/components/notes/card';
import { getOwnNotes } from '@/server/actions/notes';

export async function NotesList() {
  const notes = (await getOwnNotes())?.data;
  if (!notes) return null;
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
      {notes.length === 0 && (
        <div className="text-center bg-background rounded-md p-4 border flex flex-col items-center justify-center gap-2 h-32">
          <p className="text-sm text-muted-foreground">No notes yet</p>
        </div>
      )}
    </div>
  );
}

export function NotesListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <NoteCardSkeleton key={index} />
      ))}
    </div>
  );
}
