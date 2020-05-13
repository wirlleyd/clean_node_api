import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSurveyControler } from "../factories/controllers/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
  router.post("/surveys", adaptRoute(makeSurveyControler()));
};
