import { HttpRequest, HttpResponse } from "../protocols/http";
import { InvalidParamError, MissingParamError } from "../erros/index";
import { badRequest, serverError } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFileds = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFileds) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      return {
        statusCode: 200,
        body: {
          message: "Success to sign up.",
        },
      };
    } catch (error) {
      return serverError();
    }
  }
}
