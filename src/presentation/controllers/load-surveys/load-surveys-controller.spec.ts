import { LoadSurveysController } from "./load-surveys-controller";
import { LoadSurveys } from "../../../domain/usecases/load-surveys";
import { SurveyModel } from "../../../domain/models/survey";
import MockDate from "mockdate";
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

const makeLoadSurveyStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    load(): Promise<SurveyModel[]> {
      return new Promise((res) => res(makeFakeSurveys()));
    }
  }
  return new LoadSurveysStub();
};

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveyStub();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("Should call LoadSurveys", async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
});