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
import { SaveSurveyResult } from "../../../../domain/usecases/save-survey-result";

export class SaveSurveyResultController implements Controller {
  loadSurveyById: LoadSurveyById;
  saveSurveyResult: SaveSurveyResult;
  constructor(
    loadSurveyById: LoadSurveyById,
    saveSurveyResult: SaveSurveyResult
  ) {
    this.loadSurveyById = loadSurveyById;
    this.saveSurveyResult = saveSurveyResult;
  }
  async handle(req: HttpRequest): Promise<HttpResponse> {
    const { answer } = req.body;
    const { surveyId } = req.params;
    const accountId = req.accountId;
    try {
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map((a) => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError("answer"));
        }
      } else {
        return forbidden(new InvalidParamError("surveyId"));
      }
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
