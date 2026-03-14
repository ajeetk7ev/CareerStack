import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name?: string | null;
      avatar?: string | null;
      provider: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
