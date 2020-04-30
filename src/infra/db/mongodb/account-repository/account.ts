import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helper/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-accountBy-email-repository";
export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(account);
    const accountData = MongoHelper.map(result.ops[0]);
    return accountData;
  }

  async loadByEmail(email: String): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }
}
