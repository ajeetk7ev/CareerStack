import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
  provider: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
