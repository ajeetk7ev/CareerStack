import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Connected to Redis");
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info("Disconnected from Redis");
  }
};
