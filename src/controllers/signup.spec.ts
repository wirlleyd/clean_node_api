import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  it("Should return 400 if no name if provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
      statusCode: Number,
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
