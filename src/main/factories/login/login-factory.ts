import env from "../../config/env";
import { Controller } from "../../../presentation/protocols";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { makeLoginValidator } from "./login-validation-factory";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt.adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";

export const makeLoginControler = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    makeLoginValidator(),
    dbAuthentication
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
