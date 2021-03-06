import { DbLoadSurveyById } from "./db-load-survey-by-id";
import { SurveyModel } from "../../../domain/models/survey";
import MockDate from "mockdate";
import { LoadSurveyByIdRepository } from "../../protocols/db/survey/load-survey-by-id-repository";

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      answer: "any_answer",
      image: "any_image",
    },
  ],
  date: new Date(),
});

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe("DbLoadSurveyById", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("Should call DbLoadSurveyByIdRepository", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    const { id } = makeFakeSurvey();
    await sut.loadById(id);
    expect(loadByIdSpy).toHaveBeenCalledWith(id);
  });

  it("Should return survey on success", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const { id } = makeFakeSurvey();
    const survey = await sut.loadById(id);
    expect(survey).toEqual(makeFakeSurvey());
  });

  it("Should DbLoadSurveyById throws if DbLoadSurveyByIdRepository throw", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockRejectedValueOnce(new Promise((res, rej) => rej(new Error())));
    const { id } = makeFakeSurvey();
    const response = sut.loadById(id);
    expect(response).rejects.toThrow();
  });
});
