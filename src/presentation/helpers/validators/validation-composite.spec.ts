import { ValidationComposite } from "./validation-composite";
import { MissingParamError } from "../../erros";
import { RequiredFieldValidation } from "./required-field-validation";

interface SutTypes {
  sut: ValidationComposite;
}

const makeSut = (): SutTypes => {
  const requiredField = new RequiredFieldValidation("field");
  const sut = new ValidationComposite([requiredField]);
  return {
    sut,
  };
};

describe("Validation Composite", () => {
  it("Should return an error if any validation fails", () => {
    const { sut } = makeSut();
    const error = sut.validate({ wrongField: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  it("Should not return if succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
