import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
});
