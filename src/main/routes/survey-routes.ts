import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSurveyControler } from "../factories/controllers/add-survey/add-survey-controller-factory";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
  router.post("/surveys", adminAuth, adaptRoute(makeSurveyControler()));
};
