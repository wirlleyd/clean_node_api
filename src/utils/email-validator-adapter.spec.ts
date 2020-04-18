import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("EmailValidator Adapter", () => {
  it("shoul return false if validator return false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
  it("shoul return false if validator return valid", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });

  it("shoul call validator with currect email", () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    const isValid = sut.isValid("any_email@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
