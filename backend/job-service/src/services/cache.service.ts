import { redis } from "../config/redis.js";
import { logger } from "../config/logger.js";

export class CacheService {
  private static TTL = 3600; // 1 hour

  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = this.TTL): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Cache del error for key ${key}:`, error);
    }
  }

  static async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error(`Cache delByPattern error for pattern ${pattern}:`, error);
    }
  }
}
