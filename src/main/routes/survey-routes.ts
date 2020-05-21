import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSurveyControler } from "../factories/controllers/add-survey/add-survey-controller-factory";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeLoadSurveyControler } from "../factories/controllers/load-surveys/load-survey-controller-factory";
export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
  const auth = adaptMiddleware(makeAuthMiddleware("admin"));
  router.post("/surveys", adminAuth, adaptRoute(makeSurveyControler()));
  router.get("/surveys", auth, adaptRoute(makeLoadSurveyControler()));
};
