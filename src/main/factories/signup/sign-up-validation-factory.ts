import {
  ValidationComposite,
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
} from "../../../presentation/helpers/validators";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
