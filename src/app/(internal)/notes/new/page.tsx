import { NewNoteForm } from '@/components/notes/new-note-form';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, Save } from 'lucide-react';

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const currentDate = new Date();
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-4xl font-light text-primary">
          {type === 'voice' ? 'Voice Note' : 'New Entry'}
        </h1>
        <p className="text-muted-foreground font-regular">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="space-y-3">
        <Card>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <p className="text-[13px] font-semibold text-muted-foreground flex gap-1.5 items-center">
                  <Clock size={12} />
                  {format(currentDate, 'HH:mm a')}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-muted text-muted-foreground rounded px-1.5 py-[0.15rem] text-xs font-semibold flex gap-1 items-center">
                  <Save size={12} />
                  Unsaved
                </div>
              </div>
            </div>
            <div className="border-t pt-3">
              <NewNoteForm redirectTo="/home" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
