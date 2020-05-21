import { Controller } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { LoadSurveysController } from "../../../../presentation/controllers/load-surveys/load-surveys-controller";
import { makeDbLoadSurveys } from "../../usecases/load-survey/db-load-surveys";

export const makeLoadSurveyControler = (): Controller => {
  return makeLogControllerDecorator(
    new LoadSurveysController(makeDbLoadSurveys())
  );
};
