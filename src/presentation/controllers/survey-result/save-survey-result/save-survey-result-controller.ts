import {
  HttpResponse,
  HttpRequest,
  Controller,
  LoadSurveyById,
  ok,
} from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  loadSurveyById: LoadSurveyById;
  constructor(loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById;
  }
  async handle({ params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(surveyId);
    return ok(survey);
  }
}
