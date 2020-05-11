import { Router } from "express";
import { makeSignUpController } from "../factories/controllers/signup/sign-up-controller-factory";
import { makeLoginControler } from "../factories/controllers/login/login-controller-factory";
import { adaptRoute } from "../adapters/express-routes-adapter";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginControler()));
};
