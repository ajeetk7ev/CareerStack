import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie";
import { AUTH_MESSAGES } from "../constants/auth.constant";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Creates a new local user, signs a token, sets a cookie.
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const user = await this.authService.register(name, email, password);
    const token = signToken({ userId: user.id, email: user.email, provider: user.provider });
    setAuthCookie(res, token);

    res.status(201).json(new ApiResponse(true, AUTH_MESSAGES.REGISTER_SUCCESS, user));
  });

  /**
   * POST /auth/login
   * req.user is already set by passport.authenticate('local') middleware.
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const token = signToken({
      userId: req.user.id,
      email: req.user.email,
      provider: req.user.provider,
    });
    setAuthCookie(res, token);

    res.status(200).json(new ApiResponse(true, AUTH_MESSAGES.LOGIN_SUCCESS, req.user));
  });

  /**
   * GET /auth/google/callback  |  GET /auth/github/callback
   * req.user is set by passport.authenticate('google'/'github') middleware.
   * Redirects to CLIENT_URL after setting the auth cookie.
   */
  socialCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("OAuth authentication failed", 401);

    const token = signToken({
      userId: req.user.id,
      email: req.user.email,
      provider: req.user.provider,
    });
    setAuthCookie(res, token);

    res.redirect(env.CLIENT_URL);
  });

  /**
   * GET /auth/logout
   */
  logout = (_req: Request, res: Response, _next: NextFunction): void => {
    clearAuthCookie(res);
    res.status(200).json(new ApiResponse(true, AUTH_MESSAGES.LOGOUT_SUCCESS));
  };

  /**
   * GET /auth/me  – requires authenticate middleware
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const user = await this.authService.getProfile(req.user.id);
    res.status(200).json(new ApiResponse(true, AUTH_MESSAGES.PROFILE_FETCHED, user));
  });
}
