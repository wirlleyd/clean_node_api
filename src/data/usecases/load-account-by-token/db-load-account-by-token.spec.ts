import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";

const makeDecrypterStub = () => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((res) => res("any_value"));
    }
  }
  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe("DbLoadAccountByToken UseCase", () => {
  it("Should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
