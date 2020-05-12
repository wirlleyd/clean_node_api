import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt.adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";
import { AddAccount } from "../../../../domain/usecases/add-account";

export const makeAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  );
};
