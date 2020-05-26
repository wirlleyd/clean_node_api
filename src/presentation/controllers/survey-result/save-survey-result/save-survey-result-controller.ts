import {
  HttpResponse,
  HttpRequest,
  Controller,
  LoadSurveyById,
  ok,
  serverError,
  forbidden,
  InvalidParamError,
} from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  loadSurveyById: LoadSurveyById;
  constructor(loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById;
  }
  async handle({ params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }
      return ok(survey);
    } catch (error) {
      return serverError(error);
    }
  }
}
