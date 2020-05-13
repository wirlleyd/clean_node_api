import { HttpRequest } from "../protocols";
import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros/access-denied-error";
import { AuthMiddleware } from "./auth-middleware";

interface SutTypes {
  sut: AuthMiddleware;
}
const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();
  return {
    sut,
  };
};

describe("Auth Middleware", () => {
  it("Should return 403 if no x-access-token provided on headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
