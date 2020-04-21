import request from "supertest";
import app from "../config/app";

describe("SignUp Routes", () => {
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
