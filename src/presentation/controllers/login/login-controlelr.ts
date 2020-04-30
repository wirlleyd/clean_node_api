import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper";
import {
  Validation,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
} from "./login-protocols";
export class LoginController implements Controller {
  authentication: Authentication;
  validation: Validation;
  constructor(validation: Validation, authentication: Authentication) {
    this.validation = validation;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
