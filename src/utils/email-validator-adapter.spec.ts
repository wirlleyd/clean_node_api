import { EmailValidatorAdapter } from "./email-validator";
describe("EmailValidator Adapter", () => {
  it("shoul return false if validator return false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
});
