import { env } from "./env";

export const tokenCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax" as const,
  domain: env.COOKIE_DOMAIN || undefined,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
