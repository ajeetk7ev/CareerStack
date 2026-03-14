import app from "./app.js";
import { env } from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { logger } from "./config/logger.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    
    app.listen(env.PORT, () => {
      logger.info(`Job Service running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", () => {
  logger.info("Shutting down gracefully");
  process.exit(0);
});
