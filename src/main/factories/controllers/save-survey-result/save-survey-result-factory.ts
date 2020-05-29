import { Controller } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { SaveSurveyResultController } from "../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { makeDbLoadSurveyById } from "../../usecases/load-survey-by-id/db-load-survey-by-id-factory";
import { makeDbSaveResult } from "../../usecases/survey-result/save-survey-result/save-survey-result-factory";

export const makeSaveSurveyResultControler = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveResult()
  );
  return makeLogControllerDecorator(controller);
};
