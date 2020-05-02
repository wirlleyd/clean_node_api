import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helper/mongo-helper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

let accountCollection: Collection;

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /signup", () => {
    it("Should return 200 on signup", async () => {
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

  describe("POST /login", () => {
    it("Should return 200 on login", async () => {
      const password = await hash("123", 12);

      await accountCollection.insertOne({
        name: "Test",
        email: "test@mail.com",
        password,
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "test@mail.com",
          password: "123",
        })
        .expect(200);
    });

    it("Should return 401 on login credentials not match", async () => {
      const password = await hash("123", 12);

      await accountCollection.insertOne({
        name: "Test",
        email: "test@mail.com",
        password,
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "test@mail.com",
          password: "1234",
        })
        .expect(401);
    });
  });
});
