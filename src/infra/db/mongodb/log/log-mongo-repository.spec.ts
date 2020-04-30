import { MongoHelper } from "../helper/mongo-helper";
import { Collection } from "mongodb";
import { LogMongoRepository } from "./log-mongo-repository";
describe("Log Mongo Repository", () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  it("Should create an error log on success", async () => {
    const sut = new LogMongoRepository();
    await sut.logError("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});