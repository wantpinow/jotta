'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { emailSignInSchema } from '@/lib/auth/email/validate';
import { signUpRedirect } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInWithEmail } from '@/lib/auth/email/actions';
import { useAction } from 'next-safe-action/hooks';

export function SignInEmailForm({ redirect }: { redirect?: string }) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(signInWithEmail, {
    onSuccess: () => {
      router.push(redirect ?? signUpRedirect);
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const form = useForm<z.infer<typeof emailSignInSchema>>({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof emailSignInSchema>) => {
    execute({ ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password..." {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="ml-auto block"
          // loading={isExecuting}
          // loadingMessage="Signing in..."
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
