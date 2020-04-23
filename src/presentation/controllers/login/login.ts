import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../erros";
import { EmailValidator } from "../signup/signup-protocols";
export class LoginController implements Controller {
  emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

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
    this.emailValidator.isValid(httpRequest.body.email);
  }
}
