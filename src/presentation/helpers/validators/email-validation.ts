import { Validation } from "./validation";
import { InvalidParamError } from "../../erros";
import { EmailValidator } from "../../protocols/email-validator";

export class EmailValidation implements Validation {
  fieldName: string;
  emailValidator: EmailValidator;
  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
