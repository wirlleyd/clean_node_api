import { LoginController } from "./login-controller";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper";
import { MissingParamError, InvalidParamError, ServerError } from "../../erros";
import { Authentication, Validation } from "./login-controller-protocols";
import { AuthenticationModel } from "../../../domain/usecases/authentication";

const makeFakeHttpRequest = () => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }

  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(validationStub, authenticationStub);
  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe("Login Controller", () => {
  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const httpRequest = makeFakeHttpRequest();
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
  });
  it("Should call Authentication with currect values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  it("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  it("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 400 if validator return an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
