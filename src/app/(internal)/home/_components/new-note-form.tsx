'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MicIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Editor } from '@/components/tiptap/editor';

const newNoteSchema = z.object({
  content: z.string().min(1),
});

const exampleContent = `
<h2>Hello</h2>
<p>I am a software engineer.</p>

<h3>About me</h3>
<p>I am a software engineer with a passion for building products that help people.</p>

<h3>My projects</h3>
<ul>
  <li><a href="https://project1.com">Project 1</a></li>
  <li><a href="https://project2.com">Project 2</a></li>
  <li><a href="https://project3.com">Project 3</a></li>
</ul>

<h3>My skills</h3>
<ol>
  <li>Skill 1</li>
  <li>Skill 2</li>
  <li>Skill 3</li>
</ol>

<h3>My experience</h3>
`;

export function NewNoteForm() {
  const form = useForm<z.infer<typeof newNoteSchema>>({
    resolver: zodResolver(newNoteSchema),
    defaultValues: {
      content: exampleContent,
    },
  });
  const onSubmit = (values: z.infer<typeof newNoteSchema>) => {
    console.log(values);
    toast.success('Note saved');
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" type="button">
            <MicIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={
              form.formState.isValid && form.formState.isDirty ? 'default' : 'outline'
            }
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
