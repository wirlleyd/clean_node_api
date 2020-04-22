import { LogControllerDecorator } from "./log";
import { Controller } from "../../presentation/protocols";
import { HttpRequest, HttpResponse } from "../../presentation/protocols";
describe("LogController Decorator", () => {
  it("Should call controller handle", async () => {
    class ControllerStub implements Controller {
      handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve) =>
          resolve({
            statusCode: 200,
            body: {
              email: "any@mail.com",
              name: "any_name",
              password: "any_password",
            },
          })
        );
      }
    }
    const controllerStub = new ControllerStub();
    const sut = new LogControllerDecorator(controllerStub);
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "any@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
