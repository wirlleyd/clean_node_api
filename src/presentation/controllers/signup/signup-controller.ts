import { badRequest, serverError, ok } from "../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
} from "./signup-controller-protocols";

export class SignUpController implements Controller {
  addAccount: AddAccount;
  validation: Validation;
  constructor(addAcount: AddAccount, validation: Validation) {
    this.addAccount = addAcount;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);
      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { email, password, name } = httpRequest.body;

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
