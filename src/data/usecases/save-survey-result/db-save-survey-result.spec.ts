import { DbSaveSurveyResult } from "./db-save-survey-result";
import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "../../protocols/db/survey/save-survey-result-repository";
import { SaveSurveyResultModel } from "../../../domain/usecases/save-survey-result";
import { SurveyResultModel } from "../../../domain/models/survey-result";

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

const makeFakeSurveyResultData = (): Omit<SurveyResultModel, "id"> => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((res) => res(makeFakeSurveyResult()));
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe("DbSaveSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("Should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    await sut.save(makeFakeSurveyResultData());
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResultData());
  });

  it("Should DbSaveSurveyResult throws if SaveSurveyResultRepository thwros", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const surveyPromise = sut.save(makeFakeSurveyResultData());
    expect(surveyPromise).rejects.toThrow();
  });

  it("Should return an survey on SaveSurveyResultRepository succeeds", async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });
});
