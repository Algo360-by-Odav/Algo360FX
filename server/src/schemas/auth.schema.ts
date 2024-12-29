import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(8),
  email: z.string().email().optional()  // Make email optional for now
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
