import request from "supertest";
import app from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "../../infra/db/mongodb/helper/mongo-helper";
import env from "../config/env";
import { sign } from "jsonwebtoken";

let accountCollection: Collection;
let surveyCollection: Collection;

describe("PUT /surveys/:surveyId/results", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  it("Should return 403 on save survey without accessToken", async () => {
    await request(app)
      .put("/api/surveys/any_id/results")
      .send({
        answer: "any_answer",
      })
      .expect(403);
  });

  it("Should return 200 on save survey with accessToken", async () => {
    const { ops: account } = await accountCollection.insertOne({
      name: "any_name",
      email: "any_mail@mail.com",
      password: "any_password",
      role: "admin",
    });

    const id = account[0]._id;

    const accessToken = sign({ id }, env.jwtSecret);

    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken,
        },
      }
    );

    const { ops: survey } = await surveyCollection.insertOne({
      question: "any_question",
      answers: [
        {
          answer: "any_answer",
          image: "any_image",
        },
      ],
      date: new Date(),
    });

    await request(app)
      .put(`/api/surveys/${survey[0]._id}/results`)
      .set("x-access-token", accessToken)
      .send({
        answer: "any_answer",
      })
      .expect(200);
  });
});
