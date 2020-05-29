import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSaveSurveyResultControler } from "../factories/controllers/save-survey-result/save-survey-result-factory";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.put(
    "/surveys/:surveyId/results",
    auth(),
    adaptRoute(makeSaveSurveyResultControler())
  );
};
