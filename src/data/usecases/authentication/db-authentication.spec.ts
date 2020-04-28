import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/load-accountBy-email-repository";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  it("Shoul call LoadAccountByEmailRepository with correct email", async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async load(email: string, password: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: "any_id",
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
        };
        return new Promise((res) => res(account));
      }
    }
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepository);
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, "load");
    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
