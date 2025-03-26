'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { signInWithEmail } from '@/lib/auth/email/actions';
import { useRouter } from 'next/navigation';
import { signUpRedirect } from '@/lib/auth';

export function SignInEmailForm({ redirect }: { redirect?: string }) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(signInWithEmail, {
    onSuccess: () => {
      router.push(redirect ?? signUpRedirect);
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          execute({ email: 'test@test.com', password: 'test' });
        }}
      >
        Greet user
      </button>
    </div>
  );
}
