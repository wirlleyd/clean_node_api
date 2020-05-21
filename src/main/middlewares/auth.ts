import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";

export const auth = (role?: string) =>
  adaptMiddleware(makeAuthMiddleware(role));
