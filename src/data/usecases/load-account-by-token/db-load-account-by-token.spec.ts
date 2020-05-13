import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeDecrypterStub = () => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((res) => res("any_value"));
    }
  }
  return new DecrypterStub();
};
const makeLoadAccountRepositoryStub = () => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((res) => res(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountRepositoryStub();
  const decrypterStub = makeDecrypterStub();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe("DbLoadAccountByToken UseCase", () => {
  it("Should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token", "any_role");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  it("Should return null if decrypter return null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((res) => res(null)));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });

  it("Should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );
    await sut.load("any_token", "any_role");
    expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  it("Should return null if LoadAccountByTokenRepository return null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(new Promise((res) => res(null)));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });

  it("Should return an account if LoadAccountByTokenRepository return an account", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const account = await sut.load("any_token", "any_role");
    expect(account).toEqual(makeFakeAccount());
  });
});
