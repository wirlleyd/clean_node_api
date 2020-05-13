import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros/access-denied-error";

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((res) => res(forbidden(new AccessDeniedError())));
  }
}
