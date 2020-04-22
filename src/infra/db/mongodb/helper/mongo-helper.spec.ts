import { MongoHelper as sut } from "./mongo-helper";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it("Should reconect if mongodb is down", async () => {
    await sut.disconnect();
    const accountCollection = sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });

  it("Should return a collection if mongodb is up", async () => {
    const accountCollection = sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
