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
import MockDate from "mockdate";
import { SaveSurveyResult } from "../../../../domain/usecases/save-survey-result";
import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultModel } from "../../../../domain/usecases/save-survey-result";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id",
  },
  body: {
    answer: "any_answer",
  },
  accountId: "any_account_id",
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_survey_id",
  question: "any_question",
  answers: [
    { answer: "any_answer" },
    { answer: "any_answer", image: "any_image" },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_account_id",
  answer: "any_answer",
  surveyId: "any_survey_id",
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

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }

  return new SaveSurveyResultStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResult();
  const loadSurveyById = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResultStub
  );
  return {
    sut,
    loadSurveyById,
    saveSurveyResultStub,
  };
};

describe("SaveSurveyResultController", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

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

  it("Should call SaveResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSurveySyp = jest.spyOn(saveSurveyResultStub, "save");
    await sut.handle(makeFakeRequest());
    expect(saveSurveySyp).toHaveBeenLastCalledWith({
      accountId: "any_account_id",
      answer: "any_answer",
      surveyId: "any_survey_id",
      date: new Date(),
    });
  });

  it("Should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest
      .spyOn(saveSurveyResultStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
