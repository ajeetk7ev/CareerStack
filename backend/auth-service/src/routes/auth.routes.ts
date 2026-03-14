import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { authController } from "../container";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { AppError } from "../utils/AppError";

const router = Router();

// ── Helper: wrap passport.authenticate so errors go to next() ────────────────
const passportAuth =
  (strategy: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      strategy,
      { session: false },
      (err: Error | null, user: Express.User | false) => {
        if (err) return next(err);
        if (!user) return next(new AppError("Authentication failed", 401));
        req.user = user;
        next();
      },
    )(req, res, next);
  };

// ── Local auth ────────────────────────────────────────────────────────────────
router.post("/register", validate(registerSchema), authController.register);

router.post(
  "/login",
  validate(loginSchema),
  passportAuth("local"),
  authController.login,
);

// ── Session ───────────────────────────────────────────────────────────────────
router.get("/logout", authController.logout);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get("/me", authenticate, authController.getProfile);

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passportAuth("google"),
  authController.socialCallback,
);

// ── GitHub OAuth ──────────────────────────────────────────────────────────────
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passportAuth("github"),
  authController.socialCallback,
);

export default router;
