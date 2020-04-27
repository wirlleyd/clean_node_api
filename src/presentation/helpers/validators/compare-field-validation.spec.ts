import { CompareFieldValidation } from "./compare-fields-validation";
import { MissingParamError, InvalidParamError } from "../../erros";

interface SutTypes {
  sut: CompareFieldValidation;
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidation("field", "fieldToCompare");
  return {
    sut,
  };
};

describe("CompareField Validation", () => {
  it("Shoul return a InvalidParamError if validation fail", () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value",
    });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });
  it("Shoul not return error if validation succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });
    expect(error).toBeFalsy();
  });
});
