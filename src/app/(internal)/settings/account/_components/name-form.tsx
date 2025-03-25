'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatabaseUserAttributes } from '@/lib/auth';
import { updateUser } from '@/server/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const userOnboardingFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

export function UserNameForm({ user }: { user: DatabaseUserAttributes }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof userOnboardingFormSchema>>({
    resolver: zodResolver(userOnboardingFormSchema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    },
  });
  const onSubmit = async (values: z.infer<typeof userOnboardingFormSchema>) => {
    await updateUser({
      firstName: values.firstName,
      lastName: values.lastName,
    });
    toast.success('Name updated');
    form.reset(values);
    router.refresh();
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
