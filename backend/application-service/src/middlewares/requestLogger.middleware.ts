import { Request } from "express";
import morgan from "morgan";
import { logger } from "../config/logger.js";

morgan.token("requestId", (req) => (req as Request).requestId || "unknown");

export const requestLoggerMiddleware = morgan(
  ":method :url :status :response-time ms requestId=:requestId",
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  },
);
