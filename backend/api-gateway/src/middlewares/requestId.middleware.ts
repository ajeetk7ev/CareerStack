import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = req.headers["x-request-id"]?.toString() || uuidv4();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};
