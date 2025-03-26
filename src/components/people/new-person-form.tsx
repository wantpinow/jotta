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
import { useAction } from 'next-safe-action/hooks';

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
  const { execute, isExecuting } = useAction(createPerson, {
    onSuccess: ({ data: person }) => {
      if (!person) return;
      toast.success('Person saved');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/people/${person.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const onSubmit = (data: z.infer<typeof newPersonFormSchema>) => {
    execute({
      name: data.name,
      description: data.description,
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
            disabled={isExecuting}
          >
            {isExecuting ? 'Saving...' : 'Save Person'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
