import {
  ValidationComposite,
  RequiredFieldValidation,
} from "../../../../presentation/helpers/validators";
import { Validation } from "../../../../presentation/helpers/validators/validation";
import { EmailValidatorAdapter } from "../../../../utils/email-validator-adapter";

export const makeAddSurveyValidator = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["question", "answers"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
