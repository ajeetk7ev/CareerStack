import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import { COOKIE_NAME } from "../utils/cookie";

/**
 * JWT cookie authentication middleware.
 * Decodes the authToken cookie and sets req.user from the payload.
 * Throws 401 if the token is missing or invalid.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies[COOKIE_NAME] as string | undefined;
    if (!token) throw new AppError("Unauthorized: No token provided", 401);

    const payload = verifyToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      provider: payload.provider,
    };

    next();
  } catch (err) {
    next(err);
  }
};
