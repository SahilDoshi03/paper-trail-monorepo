import documentRouter from "../../routes/document.ts"; // Adjust path if needed
import { jest, describe, beforeEach, it } from "@jest/globals";
import { expressApp } from "../../expressApp.ts";
import { validateUserId } from "../../middleware/auth.ts";
import supertest from "supertest";

const app = expressApp();

app.use("/documents", validateUserId, documentRouter);

describe("Document Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Get Document Route", () => {
    describe("given the document does not exist", () => {
      it("should return a 404", async () => {
        const docId = "123";
        await supertest(app).get(`/api/documents/${docId}`).expect(404);
      });
    });
  });
});
