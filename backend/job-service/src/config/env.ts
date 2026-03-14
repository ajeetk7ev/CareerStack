import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5006),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  CLIENT_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(10),
  COMPANY_SERVICE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  RABBIT_URL: z.string().min(1).default("amqp://localhost"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
