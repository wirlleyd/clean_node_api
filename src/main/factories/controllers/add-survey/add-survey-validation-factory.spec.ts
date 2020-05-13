import { makeAddSurveyValidator } from "./add-survey-validation-factory";
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from "../../../../presentation/helpers/validators";
import { Validation } from "../../../../presentation/helpers/validators/validation";
import { EmailValidator } from "../../../../presentation/protocols/email-validator";

jest.mock("../../../../presentation/helpers/validators/validation-composite");

describe("LoginValidation factory", () => {
  it("Should call ValidationComposite with all validations", () => {
    makeAddSurveyValidator();
    const validations: Validation[] = [];
    for (const field of ["question", "answers"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
