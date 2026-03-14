import winston from "winston";
import { env } from "./env";

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack ?? message}`;
  },
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    consoleFormat,
  ),
  transports: [new winston.transports.Console()],
  exitOnError: false,
});
