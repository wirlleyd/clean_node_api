import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, serverError } from "../../helpers/http-helper";
import { MissingParamError, InvalidParamError, ServerError } from "../../erros";
import { EmailValidator } from "../signup/signup-protocols";
export class LoginController implements Controller {
  emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return new Promise((res) =>
          res(badRequest(new MissingParamError("email")))
        );
      }
      if (!password) {
        return new Promise((res) =>
          res(badRequest(new MissingParamError("password")))
        );
      }
      const emailIsValid = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return new Promise((res) =>
          res(badRequest(new InvalidParamError("email")))
        );
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
