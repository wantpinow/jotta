'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatabaseUserAttributes } from '@/lib/auth';
import { updateUser } from '@/server/actions/users/actions';
import { updateUserSchema } from '@/server/actions/users/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function UserNameForm({ user }: { user: DatabaseUserAttributes }) {
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    },
  });

  const { execute } = useAction(updateUser, {
    onSuccess: ({ data }) => {
      if (!data) return;
      toast.success('Name updated');
      form.reset({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
      });
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="First Name..."
                  onBlur={() => {
                    field.onBlur();
                    if (form.getFieldState('firstName').isDirty) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Last Name..."
                  onBlur={() => {
                    field.onBlur();
                    if (form.getFieldState('lastName').isDirty) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
