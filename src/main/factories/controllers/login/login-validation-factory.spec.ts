import { makeLoginValidator } from "./login-validation-factory";
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from "../../../../presentation/helpers/validators";
import { Validation } from "../../../../presentation/helpers/validators/validation";
import { EmailValidator } from "../../../../presentation/protocols/email-validator";
jest.mock("../../../../presentation/helpers/validators/validation-composite");
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatiorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatiorStub();
};

describe("LoginValidation factory", () => {
  it("Should call ValidationComposite with all validator", () => {
    makeLoginValidator();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
