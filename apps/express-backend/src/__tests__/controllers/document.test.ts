import documentRouter from "../../routes/document";
import { jest, describe, beforeEach, it } from "@jest/globals";
import { expressApp } from "../../expressApp";
import { validateUserId } from "../../middleware/auth";
import supertest from "supertest";

const app = expressApp();

app.use("/documents", validateUserId, documentRouter);

describe("Document Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 describe("getDocuments Route", () => {
  })

  describe("Get Document Route", () => {
    describe("given the document does not exist", () => {
      it("should return a 404", async () => {

        const docId = "123";

        await supertest(app).get(`/api/documents/${docId}`).expect(404);
      });
    });
  });
});
