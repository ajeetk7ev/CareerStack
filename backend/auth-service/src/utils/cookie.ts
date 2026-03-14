import { Response } from "express";
import { tokenCookieOptions } from "../config/cookie";

export const COOKIE_NAME = "authToken";

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAME, token, tokenCookieOptions);
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
};
