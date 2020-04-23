import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../erros";
export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise((res) =>
        res(badRequest(new MissingParamError("email")))
      );
    }
    if (!httpRequest.body.password) {
      return new Promise((res) =>
        res(badRequest(new MissingParamError("password")))
      );
    }
  }
}
