import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { badRequest, serverError } from "../../helpers/http-helper";
import { MissingParamError, InvalidParamError, ServerError } from "../../erros";
import { EmailValidator } from "../signup/signup-protocols";
import { Authentication } from "../../../domain/usecases/authentication";
export class LoginController implements Controller {
  emailValidator: EmailValidator;
  authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
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

      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
