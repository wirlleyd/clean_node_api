import { AddSurveyController } from "./add-survey-controler";
import { HttpRequest, HttpResponse } from "./add-survey-controller-protocols";
import { Validation } from "../../../helpers/validators/validation";
import { badRequest } from "../../../helpers/http/http-helper";

const httpRequestMaker = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
  };
};
describe("AddSurveyController", () => {
  it("Shoul call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = httpRequestMaker();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("Should return 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const httpResponde = await sut.handle(httpRequestMaker());
    expect(httpResponde).toEqual(badRequest(new Error()));
  });
});
