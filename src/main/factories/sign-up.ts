import { SignUpController } from "../../presentation/controllers/signup/signup";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt.adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { Controller } from "../../presentation/protocols";
import { LogControllerDecorator } from "../decorators/log";
import { makeSignUpValidation } from "./sign-up-validation";

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
