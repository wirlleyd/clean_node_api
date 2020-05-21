import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSurveyControler } from "../factories/controllers/add-survey/add-survey-controller-factory";
import { makeLoadSurveyControler } from "../factories/controllers/load-surveys/load-survey-controller-factory";
import { auth } from "../middlewares/auth";
export default (router: Router): void => {
  router.post("/surveys", auth("admin"), adaptRoute(makeSurveyControler()));
  router.get("/surveys", auth(), adaptRoute(makeLoadSurveyControler()));
};
