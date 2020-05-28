import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  ok,
  serverError,
  InvalidParamError,
  forbidden,
} from "./save-survey-result-controller-protocols";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_id",
  },
  body: {
    answer: "any_answer",
  },
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    { answer: "any_answer" },
    { answer: "any_answer", image: "any_image" },
  ],
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveysByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveysByIdStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
};

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyById);
  return {
    sut,
    loadSurveyById,
  };
};

describe("SaveSurveyResultController", () => {
  it("Should call LoadSurveyById with correct values", async () => {
    const { sut, loadSurveyById } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyById, "loadById");
    await sut.handle(makeFakeRequest());
    const {
      params: { surveyId },
    } = makeFakeRequest();
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId);
  });

  it("Should LoadSurveyById return an survey on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeFakeRequest());
    expect(ok(makeFakeSurvey())).toEqual(response);
  });

  it("Should SaveSurveyResultController return 403 if LoadSurveyById return null", async () => {
    const { sut, loadSurveyById } = makeSut();
    jest
      .spyOn(loadSurveyById, "loadById")
      .mockReturnValueOnce(new Promise((res) => res(null)));
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("Should  return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      params: {
        surveyId: "any_id",
      },
      body: {
        answer: "wrong_answer",
      },
    });
    expect(response).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("Should SaveSurveyResultController return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyById } = makeSut();
    jest
      .spyOn(loadSurveyById, "loadById")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new Error()));
  });
});
