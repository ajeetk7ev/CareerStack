import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5007),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SERVICE_NAME: z.string().default("application-service"),
  DATABASE_URL: z.string().min(1),
  CLIENT_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(10),
  REDIS_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),
  RABBITMQ_EXCHANGE: z.string().min(1),
  JOB_SERVICE_URL: z.string().url(),
  USER_SERVICE_URL: z.string().url(),
  CACHE_TTL_SECONDS: z.coerce.number().default(300),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
