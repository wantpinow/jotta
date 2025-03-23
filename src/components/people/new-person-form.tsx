'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Editor } from '@/components/tiptap/editor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { isFilledHtml } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createPerson } from '@/server/actions/person';
import { useTransition } from 'react';

const newPersonFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .refine(isFilledHtml, {
      message: 'Description cannot be empty',
    }),
});

export function NewPersonForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof newPersonFormSchema>>({
    resolver: zodResolver(newPersonFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof newPersonFormSchema>) => {
    startTransition(async () => {
      const person = await createPerson({
        name: data.name,
        description: data.description,
      });
      toast.success('Person saved');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/people/${person.id}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Editor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write about this person..."
                  showToolbar={false}
                  className="min-h-[200px] p-0 bg-muted/50 rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={form.formState.isValid ? 'default' : 'outline'}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Person'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
