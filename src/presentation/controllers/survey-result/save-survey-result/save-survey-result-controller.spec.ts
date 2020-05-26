import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  ok,
} from "./save-survey-result-controller-protocols";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_id",
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
});
