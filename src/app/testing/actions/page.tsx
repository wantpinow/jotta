'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { signInWithEmail } from '@/lib/auth/email/actions';

export default function TestingActionsPage() {
  const { execute, result } = useAction(signInWithEmail, {
    onSuccess: ({ data }) => {
      if (!data) return;
      toast.success(JSON.stringify(data));
    },
    onError: (error) => {
      toast.error('an error o curd');
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
      {result.data ? <p>{JSON.stringify(result.data)}</p> : null}
    </div>
  );
}
