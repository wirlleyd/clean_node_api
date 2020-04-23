import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../erros";
export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((res) =>
      res(badRequest(new MissingParamError("email")))
    );
  }
}
