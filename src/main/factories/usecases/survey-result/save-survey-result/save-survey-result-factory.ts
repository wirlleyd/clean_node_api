import { SaveSurveyResult } from "../../../../../domain/usecases/save-survey-result";
import { SurveyResultMongoRepository } from "../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { DbSaveSurveyResult } from "../../../../../data/usecases/save-survey-result/db-save-survey-result";

export const makeDbSaveResult = (): SaveSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(saveSurveyResultMongoRepository);
};
