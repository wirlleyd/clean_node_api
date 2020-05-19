import { LoadSurveysController } from "./load-surveys-controller";
import { LoadSurveys } from "../../../domain/usecases/load-surveys";
import { SurveyModel } from "../../../domain/models/survey";
import MockDate from "mockdate";
import { ok, serverError } from "../../helpers/http/http-helper";

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

  it("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({});
    expect(response).toEqual(ok(makeFakeSurveys()));
  });

  it("LoadSurveyController should throw if LoadSurvey throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, "load")
      .mockImplementationOnce(
        () => new Promise((res, rej) => rej(new Error()))
      );
    const response = await sut.handle({});
    expect(response).toEqual(serverError(new Error()));
  });
});
