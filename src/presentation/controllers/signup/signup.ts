import { InvalidParamError, MissingParamError } from "../../erros/index";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  AddAccount,
  Validation,
} from "./signup-protocols";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  addAccount: AddAccount;
  validation: Validation;
  constructor(
    emailValidator: EmailValidator,
    addAcount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAcount;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);
      if (errorValidation) {
        return badRequest(errorValidation);
      }
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
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return ok({ message: "Success to sign up.", user: account });
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
