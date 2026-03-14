import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`[${req.requestId ?? "N/A"}] ${err.stack ?? err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
