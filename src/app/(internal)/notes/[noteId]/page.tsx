import { PageHeader } from '@/components/page/header';
import { getNote } from '@/server/actions/notes';
import { format } from 'date-fns';

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const note = (await getNote({ id: noteId }))?.data;
  if (!note) {
    return <div>Note not found</div>;
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title={note.title}
        description={format(note.updatedAt, 'EEEE, MMMM d, yyyy')}
      />
    </div>
  );
}
