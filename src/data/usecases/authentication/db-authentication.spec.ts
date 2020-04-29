import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-accountBy-email-repository";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

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
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((res) => res("any_token"));
    }
  }

  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
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

  it("Should call TokenGenerator with correct id", async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  it("Should throw if TokenGenerator throws", async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  it("Should return token if TokenGenerator succeeds", async () => {
    const { sut } = makeSut();
    const token = await sut.auth(makeFakeAuthentication());
    expect(token).toBe("any_token");
  });

  it("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });
});
