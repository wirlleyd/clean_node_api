import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";

export class DbAuthentication implements Authentication {
  laodAccountByEmailRepository: LoadAccountByEmailRepository = null;
  hashCompare: HashComparer = null;
  tokenGenerator: TokenGenerator = null;
  constructor(
    laodAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.laodAccountByEmailRepository = laodAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.laodAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password
      );
      if (isValid) {
        const token = await this.tokenGenerator.generate(account.id);
        return token;
      }
    }
    return null;
  }
}
