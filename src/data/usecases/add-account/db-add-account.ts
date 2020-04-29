import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  Hasher: Hasher;
  addAccountRepository: AddAccountRepository;
  constructor(Hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.Hasher = Hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const encriptedPassword = await this.Hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: encriptedPassword,
    });
    return account;
  }
}
