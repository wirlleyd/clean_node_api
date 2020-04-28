import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/usecases/authentication";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string, password: string): Promise<AccountModel> {
      return new Promise((res) => res(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  it("Shoul call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("Shoul throw if LoadAccountByEmailRepository throws", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
