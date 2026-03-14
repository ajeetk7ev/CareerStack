import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on("error", (error) => {
  logger.error("Redis error", { error });
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) await redisClient.connect();
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) await redisClient.quit();
};
