import { auth } from '@/lib/auth/validate';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MicIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import {
  NotesList,
  NotesListSkeleton,
} from '@/app/(internal)/home/_components/notes-list';
import { Suspense } from 'react';
export default async function Home() {
  const { user } = await auth();
  if (!user) {
    return null;
  }
  const currentDate = new Date();
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-4xl font-light text-primary">Daily Journal</h1>
        <p className="text-muted-foreground font-regular">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/notes/new">
            <PlusIcon />
            New Entry
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/notes/new?type=voice">
            <MicIcon />
            Voice Note
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        <Suspense fallback={<NotesListSkeleton />}>
          <NotesList />
        </Suspense>
      </div>
    </div>
  );
}
