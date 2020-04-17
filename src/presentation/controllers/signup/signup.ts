import { InvalidParamError, MissingParamError } from "../../erros/index";
import { badRequest, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  AddAccount,
} from "./signup-protocols";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAcount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAcount;
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
      const { email, passwordConfirmation, password, name } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      this.addAccount.add({
        name,
        email,
        password,
      });
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
