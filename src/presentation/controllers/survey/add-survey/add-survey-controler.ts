import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../helpers/validators/validation";
import { badRequest } from "../../../helpers/http/http-helper";

export class AddSurveyController implements Controller {
  validation: Validation;
  constructor(validation: Validation) {
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }
    return new Promise((res) => res(null));
  }
}
