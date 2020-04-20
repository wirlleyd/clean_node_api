import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  encrypter: Encrypter;
  addAccountRepository: AddAccountRepository;
  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const encriptedPassword = await this.encrypter.encrypt(
      accountData.password
    );
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: encriptedPassword,
    });
    return account;
  }
}
