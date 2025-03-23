import { getNote } from '@/server/actions/notes';

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const note = await getNote({ id: noteId });
  return <pre>{JSON.stringify(note, null, 2)}</pre>;
}
