import type { CurrentUser } from "./CurrentUser.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser;
    }
  }
}

export {};
