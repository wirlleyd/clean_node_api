import { DbAddAccount } from "./db-add-account";
import {
  Hasher,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-accountBy-email-repository";

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((res) => res(null));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
interface SutTypes {
  sut: DbAddAccount;
  HasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(
    HasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );
  return {
    HasherStub,
    sut,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DBAddAccount Usecase", () => {
  it("should call Hasher with correct password", async () => {
    const { HasherStub, sut } = makeSut();
    const hashSpy = jest.spyOn(HasherStub, "hash");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(hashSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });

  it("should throw if Hasher throws", async () => {
    const { HasherStub, sut } = makeSut();
    jest
      .spyOn(HasherStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promiseAccount = sut.add(accountData);
    await expect(promiseAccount).rejects.toThrow();
  });

  it("should throw if AddAccount throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    };
    const promiseAccount = sut.add(accountData);
    await expect(promiseAccount).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    };
    const account = await sut.add(makeFakeAccount());
    expect(account).toEqual({ ...accountData, id: "valid_id" });
  });

  it("should return null if LoadAccountByEmailRepository not returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(new Promise((res) => res(makeFakeAccount())));
    const account = await sut.add(makeFakeAccount());
    expect(account).toBeNull();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    };
    const account = await sut.add(makeFakeAccount());
    expect(account).toEqual({ ...accountData, id: "valid_id" });
  });

  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(makeFakeAccount());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
