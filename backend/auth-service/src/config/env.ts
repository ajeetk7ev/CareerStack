import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),

  CLIENT_URL: z.string().url(),

  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),

  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
