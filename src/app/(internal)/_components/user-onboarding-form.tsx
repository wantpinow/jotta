'use client';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatabaseUserAttributes } from '@/lib/auth';
import { updateUser } from '@/server/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
const userOnboardingFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

export function UserOnboardingForm({ user }: { user: DatabaseUserAttributes }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof userOnboardingFormSchema>>({
    resolver: zodResolver(userOnboardingFormSchema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    },
  });
  const onSubmit = (values: z.infer<typeof userOnboardingFormSchema>) => {
    updateUser({
      firstName: values.firstName,
      lastName: values.lastName,
    });
    toast.success('Profile updated');
    router.refresh();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="First Name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Last Name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="block ml-auto">
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
