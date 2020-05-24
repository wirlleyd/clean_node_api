import { SaveSurveyResultRepository } from "../../protocols/db/survey/save-survey-result-repository";
import { SaveSurveyResultModel } from "../../../domain/usecases/save-survey-result";
import { SurveyResultModel } from "../../../domain/models/survey-result";
import { MongoHelper } from "../../../infra/db/mongodb/helper/mongo-helper";

export class DbSaveSurveyResult implements SaveSurveyResultRepository {
  saveSurveyResultRepository: SaveSurveyResultRepository;
  constructor(saveSurveyResultRepository: SaveSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository;
  }
  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = this.saveSurveyResultRepository.save(surveyData);
    return survey;
  }
}
