import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helper/mongo-helper";
export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(account);
    const accountData = MongoHelper.map(result.ops[0]);
    return accountData;
  }
}
