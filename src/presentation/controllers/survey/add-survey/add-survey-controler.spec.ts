import { AddSurveyController } from "./add-survey-controler";
import { HttpRequest, HttpResponse } from "./add-survey-controller-protocols";
import { Validation } from "../../../helpers/validators/validation";

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

const validationStubMaker = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
};
const makeSut = (): SutTypes => {
  const validationStub = validationStubMaker();
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
});
