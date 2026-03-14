import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const server = app.listen(env.PORT, () => {
  logger.info(
    `Auth service running on port ${env.PORT} in ${env.NODE_ENV} mode`,
  );
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
