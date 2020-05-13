import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { forbidden, ok } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros/access-denied-error";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";

export class AuthMiddleware implements Middleware {
  loadAccountByToken: LoadAccountByToken;
  constructor(loadAccountByToken: LoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);
      if (account) {
        return ok(account);
      }
    }
    return forbidden(new AccessDeniedError());
  }
}
