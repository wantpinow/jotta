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
import { PageHeader } from '@/components/page/header';

export default async function Home() {
  const { user } = await auth();
  if (!user) {
    return null;
  }
  const currentDate = new Date();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Journal"
        description={format(currentDate, 'EEEE, MMMM d, yyyy')}
      />
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
