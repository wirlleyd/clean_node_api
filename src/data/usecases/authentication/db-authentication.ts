import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/load-accountBy-email-repository";

export class DbAuthentication implements Authentication {
  laodAccountByEmailRepository = null;
  constructor(laodAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.laodAccountByEmailRepository = laodAccountByEmailRepository;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.laodAccountByEmailRepository.load(authentication.email);
    return null;
  }
}
