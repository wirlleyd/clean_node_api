import { DbAddAccount } from "./db-add-account";
import {
  Hasher,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

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
interface SutTypes {
  sut: DbAddAccount;
  HasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub);
  return {
    HasherStub,
    sut,
    addAccountRepositoryStub,
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
    sut.add(accountData);
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
    const account = await sut.add(accountData);
    expect(account).toEqual({ ...accountData, id: "valid_id" });
  });
});
