import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { logger } from "../config/logger.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(
    error instanceof Error ? error.stack || error.message : "Unknown error",
  );

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues.map((issue) => issue.message).join(", "),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
