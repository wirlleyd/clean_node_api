import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { AccountModel } from "../../../domain/models/account";
import { Decrypter } from "../../protocols/criptography/decrypter";

export class DbLoadAccountByToken implements LoadAccountByToken {
  decrypter: Decrypter;

  constructor(decrypter: Decrypter) {
    this.decrypter = decrypter;
  }

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const decriptedValue = await this.decrypter.decrypt(accessToken);
    return null;
  }
}
