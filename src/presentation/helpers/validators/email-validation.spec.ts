import { HttpRequest } from "../../protocols";
import { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";
import { InvalidParamError } from "../../erros";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email Validation", () => {
  it("Should return and error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({ email: "any_email@mail.com" });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  it("should return 500 if EmailValidator throws", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });

  it("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any_email@mail.com" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
