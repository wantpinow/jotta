import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateUserImageSchema = z.object({
  imageUrl: z.string().url(),
});
