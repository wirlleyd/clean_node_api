import { LoadSurveys } from "../../../domain/usecases/load-surveys";
import { LoadSurveyRepository } from "../../protocols/db/survey/load-survey-repository";
import { SurveyModel } from "../../../domain/models/survey";

export class DbLoadSurveys implements LoadSurveys {
  loadSurveyRepository: LoadSurveyRepository;
  constructor(loadSurveyRepository: LoadSurveyRepository) {
    this.loadSurveyRepository = loadSurveyRepository;
  }
  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll();
    return surveys;
  }
}
