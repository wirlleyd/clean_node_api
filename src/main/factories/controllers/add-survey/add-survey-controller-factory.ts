import { Controller } from "../../../../presentation/protocols";
import { makeAddSurveyValidator } from "./add-survey-validation-factory";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { AddSurveyController } from "../../../../presentation/controllers/survey/add-survey/add-survey-controler";
import { makeAddSurvey } from "../../usecases/add-survey/db-add-survey-factory";

export const makeSurveyControler = (): Controller => {
  return makeLogControllerDecorator(
    new AddSurveyController(makeAddSurveyValidator(), makeAddSurvey())
  );
};
