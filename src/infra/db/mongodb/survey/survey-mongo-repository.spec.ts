import { MongoHelper } from "../helper/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";
import { Collection } from "mongodb";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";

let surveyCollection: Collection;

const makeFakeSurveyData = (): AddSurveyModel[] => [
  {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
  {
    question: "other_question",
    answers: [
      {
        image: "other_image",
        answer: "other_answer",
      },
    ],
    date: new Date(),
  },
];

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  describe("Add", () => {
    it("Should add an survey on add success", async () => {
      const sut = makeSut();
      await sut.add({
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
          {
            answer: "other_answer",
          },
        ],
        date: new Date(),
      });
      const survey = await surveyCollection.findOne({
        question: "any_question",
      });
      expect(survey).toBeTruthy();
    });
  });
  describe("LoadAll", () => {
    it("Should load all surveys on success", async () => {
      await surveyCollection.insertMany(makeFakeSurveyData());
      const sut = makeSut();
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(2);
    });

    it("Should load empty list", async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(0);
    });
  });
  describe("LoadById", () => {
    it("Should load survey by id", async () => {
      const {
        ops: [survey, ...otherProps],
      } = await surveyCollection.insertOne({
        question: "any_question",
        answer: [
          {
            image: "any_image",
            answer: "any_answer",
          },
        ],
        date: new Date(),
      });
      const { _id: id } = survey;
      const sut = makeSut();
      const result = await sut.loadById(id);
      expect(result).toBeTruthy();
    });
  });
});
