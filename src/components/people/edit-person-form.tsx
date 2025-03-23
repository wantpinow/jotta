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
import { updatePerson } from '@/server/actions/person';
import { useTransition } from 'react';
import { Person } from '@/server/db/schema/types';

const editPersonFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .refine(isFilledHtml, {
      message: 'Description cannot be empty',
    }),
});

export function EditPersonForm({
  person,
  redirectTo,
}: {
  person: Person;
  redirectTo?: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof editPersonFormSchema>>({
    resolver: zodResolver(editPersonFormSchema),
    defaultValues: {
      name: person.name,
      description: person.description || '',
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof editPersonFormSchema>) => {
    startTransition(async () => {
      await updatePerson({
        id: person.id,
        name: data.name,
        description: data.description,
      });
      toast.success('Person updated');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/people/${person.id}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  showToolbar={true}
                  className="min-h-[200px] p-0 bg-muted/50 rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.push(`/people/${person.id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={form.formState.isValid ? 'default' : 'outline'}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Update Person'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
