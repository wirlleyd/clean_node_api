import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";

export class DbAuthentication implements Authentication {
  laodAccountByEmailRepository: LoadAccountByEmailRepository = null;
  hashCompare: HashComparer = null;
  constructor(
    laodAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashComparer
  ) {
    this.laodAccountByEmailRepository = laodAccountByEmailRepository;
    this.hashCompare = hashCompare;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.laodAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      this.hashCompare.compare(authentication.password, account.password);
    }
    return null;
  }
}
