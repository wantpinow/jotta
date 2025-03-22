import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MicIcon } from 'lucide-react';

export function NewNoteCard() {
  return (
    <Card className="bg-muted max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Note</CardTitle>
        <CardDescription>Write about your day, thoughts, and feelings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write about your day, thoughts, and feelings."
          className="resize-none bg-background"
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <MicIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
