import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt.adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignUpValidation } from "./sign-up-validation-factory";

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const logMongoRepository = new LogMongoRepository();

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
