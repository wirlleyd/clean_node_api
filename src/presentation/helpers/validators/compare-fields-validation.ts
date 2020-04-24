import { Validation } from "./validation";
import { InvalidParamError } from "../../erros";

export class CompareFieldValidation implements Validation {
  fieldName: string;
  fieldToCompareName: string;

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToCompareName = fieldToCompareName;
  }
  validate(input: any): Error {
    if (!input[this.fieldName] !== input(this.fieldToCompareName)) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
