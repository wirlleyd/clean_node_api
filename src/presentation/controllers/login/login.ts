import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
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
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;
      const emailIsValid = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
