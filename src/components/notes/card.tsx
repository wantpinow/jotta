import { Clock, User } from 'lucide-react';
import { Note } from '@/server/db/schema/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { NoteCardActions } from '@/components/notes/card-actions';
import { Skeleton } from '@/components/ui/skeleton';

export function NoteCard({ note }: { note: Note }) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-[13px] font-semibold text-muted-foreground flex gap-1.5 items-center">
              <Clock size={12} />
              {format(note.updatedAt, 'HH:mm a')}
            </p>
            <div className="bg-secondary/20 text-secondary rounded px-1.5 py-[0.15rem] text-xs font-semibold">
              Shopping
            </div>
            <div className="bg-primary/20 text-primary rounded px-1.5 py-[0.15rem] text-xs font-semibold flex gap-1 items-center">
              <User className="fill-primary" size={12} />
              Patrick
            </div>
          </div>
          <NoteCardActions note={note} />
        </div>
        <div
          className="ProseMirror border-t pt-3"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </CardContent>
    </Card>
  );
}

export function NoteCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-12" />
      </CardContent>
    </Card>
  );
}
