import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { logger } from "../config/logger.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(error.message, {
    requestId: req.requestId,
    stack: error.stack,
  });

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
