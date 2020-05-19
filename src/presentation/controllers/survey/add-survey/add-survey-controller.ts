import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../helpers/validators/validation";
import {
  badRequest,
  serverError,
  noContent,
} from "../../../helpers/http/http-helper";
import { AddSurvey } from "../../../../domain/usecases/add-survey";

export class AddSurveyController implements Controller {
  validation: Validation;
  addSurvey: AddSurvey;
  constructor(validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation;
    this.addSurvey = addSurvey;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({ question, answers, date: new Date() });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
