import { makeSignUpValidation } from "./sign-up-validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { CompareFieldValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { EmailValidator } from "../../presentation/protocols/email-validator";

jest.mock("../../presentation/helpers/validators/validation-composite");

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
