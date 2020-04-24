import { Validation } from "./validation";
import { MissingParamError } from "../../erros";

export class RequiredFieldValidation implements Validation {
  fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }
  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
