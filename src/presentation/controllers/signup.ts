import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../erros/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { InvalidParamError } from "../erros/invalid-param-error";
export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
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
    console.log(isValid);

    if (!isValid) {
      return badRequest(new InvalidParamError("email"));
    }

    return {
      statusCode: 200,
      body: {
        message: "Success to sign up.",
      },
    };
  }
}
