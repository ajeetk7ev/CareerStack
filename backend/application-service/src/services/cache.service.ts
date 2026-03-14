import { redisClient } from "../config/redis.js";
import { env } from "../config/env.js";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttl = env.CACHE_TTL_SECONDS) {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  }

  async del(key: string) {
    await redisClient.del(key);
  }

  async invalidateByPattern(pattern: string) {
    const keys: string[] = [];
    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(String(key));
    }

    if (keys.length) {
      await redisClient.del(keys);
    }
  }
}
