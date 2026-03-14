import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { configurePassport } from "./config/passport";
import { authService } from "./container";
import { AppError } from "./utils/AppError";
import authRouter from "./routes/auth.routes";

const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Passport (no sessions — stateless JWT via cookie) ─────────────────────────
configurePassport(authService);
app.use(passport.initialize());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth", authRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  logger.error(err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
});

export default app;
