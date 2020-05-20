import { DbLoadSurveys } from "./db-load-surveys";
import { LoadSurveyRepository } from "../../protocols/db/survey/load-survey-repository";
import { SurveyModel } from "../../../domain/models/survey";

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          answer: "any_answer",
          image: "any_image",
        },
      ],
      date: new Date(),
    },
  ];
};

const makeLoadSurveysRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveyRepository {
    loadAll(): Promise<SurveyModel[]> {
      return new Promise((res) => res(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveyRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe("DbLoadSurveys", () => {
  it("Should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toBeCalled();
  });
});
