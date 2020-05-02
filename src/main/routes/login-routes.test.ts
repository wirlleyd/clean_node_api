import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helper/mongo-helper";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  it("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Test",
        email: "test@mail.com",
        password: "123456",
        passwordConfirmation: "123456",
      })
      .expect(200);
  });
});
