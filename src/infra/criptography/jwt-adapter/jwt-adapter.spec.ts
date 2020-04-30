import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: (): Promise<string> => {
    return new Promise((res) => res("any_token"));
  },
}));

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret");
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  test("Should return a token on sign success", async () => {
    const sut = new JwtAdapter("secret");
    const token = await sut.encrypt("any_id");
    expect(token).toBe("any_token");
  });

  test("Should JwtAdapter throws if sign throws", async () => {
    const sut = new JwtAdapter("secret");
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error();
    });
    const token = sut.encrypt("any_id");
    await expect(token).rejects.toThrow();
  });
});
