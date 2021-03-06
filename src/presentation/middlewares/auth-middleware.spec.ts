import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros/access-denied-error";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";
import { HttpRequest } from "../protocols";

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeLoadAccountStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load(accessToken: String, role?: string): Promise<AccountModel> {
      return new Promise((res) => res(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};
interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe("Auth Middleware", () => {
  it("Should return 403 if no x-access-token provided on headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("Should return 403 if LoadAccountByToken return null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((res) => res(null)));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("Should return 200 if LoadAccountByToken return an account", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });

  it("Should call LoadAccountByToken with correct access token", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle(makeFakeHttpRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token", role);
  });
});
