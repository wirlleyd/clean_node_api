import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from "../../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
} from "./signup-controller-protocols";
import {} from "../login/login-controller-protocols";
import { EmailInUseError } from "../../../erros";
import { Authentication } from "../../../../domain/usecases/authentication";

export class SignUpController implements Controller {
  addAccount: AddAccount;
  validation: Validation;
  authentication: Authentication;
  constructor(
    addAcount: AddAccount,
    validation: Validation,
    authentication: Authentication
  ) {
    this.addAccount = addAcount;
    this.validation = validation;
    this.authentication = authentication;
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
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken });
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
