import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { connectRabbitMQ, disconnectRabbitMQ } from "./config/rabbitmq.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Postgres connected");

    await connectRedis();
    logger.info("Redis connected");

    await connectRabbitMQ();
    logger.info("RabbitMQ connected");

    const server = app.listen(env.PORT, () => {
      logger.info(`Application service running on port ${env.PORT}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);

      server.close(async () => {
        await prisma.$disconnect();
        await disconnectRedis();
        await disconnectRabbitMQ();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

void startServer();
