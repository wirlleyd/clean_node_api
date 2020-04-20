import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter();
};

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
  it("Should return a hash on sucess", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  it("Should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockReturnValueOnce(new Promise((res, rej) => rej(new Error())));
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
