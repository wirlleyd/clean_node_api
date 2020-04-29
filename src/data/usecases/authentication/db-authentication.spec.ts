import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise((res) => res(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
});

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return new Promise((res) => res(true));
    }
  }
  return new HashComparerStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  };
};

describe("DbAuthentication UseCase", () => {
  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(null);
    const token = await sut.auth(makeFakeAuthentication());
    expect(token).toBeNull();
  });

  it("Should call HashComparer with correct values", async () => {
    const { hashComparerStub, sut } = makeSut();
    const comparerSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(comparerSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  it("Should throw if HashComparer throws", async () => {
    const { hashComparerStub, sut } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  it("Should return null if HashComparer returns false", async () => {
    const { hashComparerStub, sut } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((res) => res(false)));
    const token = await sut.auth(makeFakeAuthentication());
    expect(token).toBeNull();
  });
});
