import { Person } from '@/server/db/schema/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonCardActions } from '@/components/people/card-actions';
import { User } from 'lucide-react';

export function PersonCard({ person }: { person: Person }) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-muted-foreground flex gap-2.5 items-center">
            <User size={20} />
            {person.name}
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-[13px] text-muted-foreground">
              Updated {format(person.updatedAt, 'MMM d, yyyy')}
            </p>
            <PersonCardActions person={person} />
          </div>
        </div>
        <div
          className="ProseMirror border-t pt-3 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: person.description || '' }}
        />
      </CardContent>
    </Card>
  );
}

export function PersonCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center pt-3">
          <Skeleton className="w-1/4 h-6" />
          <Skeleton className="w-1/6 h-4" />
        </div>
        <div className="border-t pt-3">
          <Skeleton className="w-full h-12" />
        </div>
      </CardContent>
    </Card>
  );
}
