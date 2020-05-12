import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../helpers/validators/validation";
import { badRequest } from "../../../helpers/http/http-helper";
import { AddSurvey } from "../../../../domain/usecases/add-survey";

export class AddSurveyController implements Controller {
  validation: Validation;
  addSurvey: AddSurvey;
  constructor(validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation;
    this.addSurvey = addSurvey;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }
    const { question, answers } = httpRequest.body;
    await this.addSurvey.add({ question, answers });
    return new Promise((res) => res(null));
  }
}
