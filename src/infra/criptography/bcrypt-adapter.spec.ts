import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    const sut = new BcryptAdapter();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
  it("Should return a hash on sucess", async () => {
    const sut = new BcryptAdapter();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });
});
