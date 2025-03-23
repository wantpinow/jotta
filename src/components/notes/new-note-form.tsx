'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Editor } from '@/components/tiptap/editor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { File, Mic } from 'lucide-react';
import { isFilledHtml } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createNote } from '@/server/actions/notes';
import { useTransition } from 'react';

const newNoteFormSchema = z.object({
  content: z.string().min(1, { message: 'Note cannot be empty' }).refine(isFilledHtml, {
    message: 'Note cannot be empty',
  }),
});

export function NewNoteForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof newNoteFormSchema>>({
    resolver: zodResolver(newNoteFormSchema),
    defaultValues: {
      content: '',
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: z.infer<typeof newNoteFormSchema>) => {
    startTransition(async () => {
      const note = await createNote({ content: data.content });
      toast.success('Note saved');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/notes/${note.id}`);
      }
    });
  };

  const peopleNames = [
    {
      id: '1',
      name: 'John Doe',
    },
    {
      id: '2',
      name: 'Bob Smith',
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your note here..."
                  showToolbar={false}
                  className="p-0 bg-muted/50 rounded-md"
                  peopleMentions={true}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => toast.error('File upload coming soon')}
            >
              <File size={12} />
            </Button>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => toast.error('Voice recording coming soon')}
            >
              <Mic size={12} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" type="button">
              Reset
            </Button>
            <Button
              type="submit"
              variant={form.formState.isValid ? 'default' : 'outline'}
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
