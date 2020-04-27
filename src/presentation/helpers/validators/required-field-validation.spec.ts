import { RequiredFieldValidation } from "./required-field-validation";
import { MissingParamError } from "../../erros";

describe("RequiredField Validation", () => {
  it("Shoul return a MessingParamError if validation fail", () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
