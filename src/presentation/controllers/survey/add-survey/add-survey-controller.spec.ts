import { AddSurveyController } from "./add-survey-controller";
import {
  HttpRequest,
  AddSurveyModel,
  AddSurvey,
} from "./add-survey-controller-protocols";
import { Validation } from "../../../helpers/validators/validation";
import {
  badRequest,
  serverError,
  noContent,
} from "../../../helpers/http/http-helper";
import MockDate from "mockdate";

const httpRequestMaker = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
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

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise((res) => res());
    }
  }
  return new AddSurveyStub();
};

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};
describe("AddSurveyController", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

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

  it("Shoul call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = httpRequestMaker();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("Should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest
      .spyOn(addSurveyStub, "add")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const httpResponde = await sut.handle(httpRequestMaker());
    expect(httpResponde).toEqual(serverError(new Error()));
  });

  it("Shoul return 204 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestMaker();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(noContent());
  });
});
