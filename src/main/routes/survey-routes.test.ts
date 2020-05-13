import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helper/mongo-helper";
import { Collection } from "mongodb";

let surveyCollection: Collection;

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("survey");
    await surveyCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("Should return 204 on addsurvey success", async () => {
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
        .expect(204);
    });
  });
});
