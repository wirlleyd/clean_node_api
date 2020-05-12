import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../helpers/validators/validation";

export class AddSurveyController implements Controller {
  validation: Validation;
  constructor(validation: Validation) {
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return new Promise((res) => res(null));
  }
}
