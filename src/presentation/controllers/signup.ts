import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../erros/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
export class SignUpController implements Controller {
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
    return {
      statusCode: 200,
      body: {
        message: "Success to sign up.",
      },
    };
  }
}
