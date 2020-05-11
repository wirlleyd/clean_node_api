import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-accountBy-email-repository";

export class DbAddAccount implements AddAccount {
  Hasher: Hasher;
  addAccountRepository: AddAccountRepository;
  loadAccountByEmailRepository: LoadAccountByEmailRepository;
  constructor(
    Hasher: Hasher,
    addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.Hasher = Hasher;
    this.addAccountRepository = addAccountRepository;
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    const encriptedPassword = await this.Hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: encriptedPassword,
    });
    return account;
  }
}
