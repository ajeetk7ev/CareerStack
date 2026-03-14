import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const validate =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = result.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => issue.message)
          .join(", ");
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
