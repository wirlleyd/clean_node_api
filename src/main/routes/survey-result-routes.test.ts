import request from "supertest";
import app from "../config/app";

describe("PUT /surveys/:surveyId/results", () => {
  it("Should return 403 on save survey without accessToken", async () => {
    await request(app)
      .put("/api/surveys/any_id/results")
      .send({
        answer: "any_answer",
      })
      .expect(403);
  });
});
