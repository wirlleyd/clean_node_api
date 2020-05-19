import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { LoadSurveys } from "../../../domain/usecases/load-surveys";

export class LoadSurveysController implements Controller {
  loadSurveys: LoadSurveys;
  constructor(loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return null;
  }
}
