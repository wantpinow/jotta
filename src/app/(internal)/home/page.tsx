import { Skeleton } from '@/components/ui/skeleton';
import { NewNoteCard } from './_components/new-note-card';
import { NotesList } from './_components/notes-list';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <div className="py-10 max-w-3xl mx-auto">
      <NewNoteCard />
      <div>
        Your Notes
        <Suspense fallback={<Skeleton className="h-40 w-full bg-background" />}>
          <NotesList />
        </Suspense>
      </div>
    </div>
  );
}
