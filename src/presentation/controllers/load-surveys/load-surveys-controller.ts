import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { LoadSurveys } from "../../../domain/usecases/load-surveys";
import { ok } from "../../helpers/http/http-helper";

export class LoadSurveysController implements Controller {
  loadSurveys: LoadSurveys;
  constructor(loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return ok(surveys);
  }
}
