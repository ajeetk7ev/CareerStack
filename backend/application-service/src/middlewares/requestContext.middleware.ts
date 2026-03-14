import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const requestContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId =
    typeof req.headers["x-request-id"] === "string"
      ? req.headers["x-request-id"]
      : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
