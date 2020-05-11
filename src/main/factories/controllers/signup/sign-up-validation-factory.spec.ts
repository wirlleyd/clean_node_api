import { makeSignUpValidation } from "./sign-up-validation-factory";
import { Validation } from "../../../../presentation/helpers/validators/validation";
import { EmailValidator } from "../../../../presentation/protocols/email-validator";
import {
  ValidationComposite,
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
} from "../../../../presentation/helpers/validators";

jest.mock("../../../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe("SignUpValidation factory", () => {
  it("Should call ValidationComposite with all validator", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldValidation("password", "passwordConfirmation"),
      new EmailValidation("email", makeEmailValidator())
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
