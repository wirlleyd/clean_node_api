import { Middleware } from "../../../presentation/protocols/middleware";
import { AuthMiddleware } from "../../../presentation/middlewares/auth-middleware";
import { makeDbLoadAcountByToken } from "../usecases/load-account-by-token/db-load-account-by-token-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAcountByToken(), role);
};
