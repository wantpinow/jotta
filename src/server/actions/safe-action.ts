import { auth } from '@/lib/auth/validate';
import { createSafeActionClient } from 'next-safe-action';

export class ActionError extends Error {
  constructor(message: string) {
    super(message); // Pass message to the parent Error class
    this.name = 'ActionError'; // Set the name of the error
  }
}

export const publicAction = createSafeActionClient({
  handleServerError(e) {
    console.error(e.name, e.message);
    if (e.name === 'ActionError') {
      return e.message;
    }
    return 'An error occurred';
  },
}).use(async ({ next }) => {
  const result = await next({ ctx: {} });
  return result;
});

export const authenticatedAction = publicAction.use(async ({ next }) => {
  const { user, session } = await auth();
  if (user === null || session === null) {
    throw new ActionError('Not signed in');
  }
  return next({ ctx: { user, session } });
});
