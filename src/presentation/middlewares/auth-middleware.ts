import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros/access-denied-error";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";

export class AuthMiddleware implements Middleware {
  loadAccountByToken: LoadAccountByToken;
  role: string;
  constructor(loadAccountByToken: LoadAccountByToken, role?: string) {
    this.loadAccountByToken = loadAccountByToken;
    this.role = role;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        );
        return account && ok({ accountId: account.id });
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
