import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
  laodAccountByEmailRepository: LoadAccountByEmailRepository = null;
  hashCompare: HashComparer = null;
  Encrypter: Encrypter = null;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  constructor(
    laodAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashComparer,
    Encrypter: Encrypter,
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  ) {
    this.laodAccountByEmailRepository = laodAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.Encrypter = Encrypter;
    this.updateAccessTokenRepositoryStub = updateAccessTokenRepositoryStub;
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
        const token = await this.Encrypter.encrypt(account.id);
        await this.updateAccessTokenRepositoryStub.updateAccessToken(
          account.id,
          token
        );
        return token;
      }
    }
    return null;
  }
}
