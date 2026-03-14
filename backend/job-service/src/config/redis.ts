import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("Successfully connected to Redis");
});

redis.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

export { redis };
