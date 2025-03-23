import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NewNoteForm } from '@/app/(internal)/home/_components/new-note-form';

export function NewNoteCard() {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>New Note</CardTitle>
        <CardDescription>Write about your day, thoughts, and feelings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NewNoteForm />
      </CardContent>
    </Card>
  );
}
