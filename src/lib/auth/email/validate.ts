import { z } from 'zod';

export const emailSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  redirect: z.string().optional(),
});
