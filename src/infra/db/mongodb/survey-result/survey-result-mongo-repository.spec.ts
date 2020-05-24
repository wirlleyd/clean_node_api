import { MongoHelper } from "../helper/mongo-helper";
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository";
import { Collection } from "mongodb";
import { SurveyModel } from "../../../../domain/models/survey";
import { AccountModel } from "../../../../domain/models/account";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSurvey = async (): Promise<SurveyModel> => {
  const {
    ops: [survey, ...otherProps],
  } = await surveyCollection.insertOne({
    question: "any_question",
    answers: [{ answer: "any_answer", image: "any_image" }],
    date: new Date(),
  });
  return MongoHelper.map(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
  const {
    ops: [account, ...otherProps],
  } = await accountCollection.insertOne({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
  });
  return MongoHelper.map(account);
};

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

describe("Survey Result Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection("surveys");
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("surveys");
    await accountCollection.deleteMany({});
  });

  describe("Save", () => {
    it("Should add an survey result if its new", async () => {
      const suvey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      const result = await sut.save({
        surveyId: suvey.id,
        accountId: account.id,
        answer: suvey.answers[0].answer,
        date: new Date(),
      });
      expect(result).toBeTruthy();
    });
  });
});
