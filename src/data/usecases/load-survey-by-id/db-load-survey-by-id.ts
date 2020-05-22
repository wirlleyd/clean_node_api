import { LoadSurveyByIdRepository } from "../../protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysById } from "../../../domain/usecases/load-surveys-by-id";
import { SurveyModel } from "../../../domain/models/survey";
export class DbLoadSurveyById implements LoadSurveysById {
  loadSurveyByIdRepository: LoadSurveyByIdRepository;
  constructor(loadSurveyByIdRepository: LoadSurveyByIdRepository) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository;
  }
  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
