import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helper/mongo-helper";
import { Collection } from "mongodb";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { SurveyModel } from "../../domain/models/survey";

let surveyCollection: Collection;

let accountCollection: Collection;

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
describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("survey");
    accountCollection = await MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("Should return 403 on addsurvey without accessToken", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
          ],
        })
        .expect(403);
    });

    it("Should return 204 on addsurvey with valid accessToken", async () => {
      const response = await accountCollection.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        role: "admin",
      });
      const id = response.ops[0]._id;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection.updateOne(
        { _id: id },
        {
          $set: {
            accessToken,
          },
        }
      );
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
          ],
        })
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    it("Should return 403 on load surveys without accessToken", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    it("Should return 200 on load surveys with accessToken", async () => {
      const response = await accountCollection.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
      });
      const id = response.ops[0]._id;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection.updateOne(
        { _id: id },
        {
          $set: {
            accessToken,
          },
        }
      );
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(200);
    });
  });
});
