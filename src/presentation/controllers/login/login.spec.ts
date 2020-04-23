import { LoginController } from "./login";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { MissingParamError } from "../../erros";
describe("Login Controller", () => {
  it("Should return 400 if no email provider", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("Should return 400 if no password provider", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        email: "any_email",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});
