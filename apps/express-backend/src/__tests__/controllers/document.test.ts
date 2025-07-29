import request from "supertest";
import express from "express";
import * as documentService from "../../services/document.ts";
import documentRouter from "../../routes/document.ts"; // Adjust path if needed
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import {expressApp} from '../../expressApp.ts'

jest.mock("../services/document.ts");

const mockDocumentService = documentService as jest.Mocked<
  typeof documentService
>;

const app = expressApp()

app.use((req, res, next) => {
  // Mock middleware: inject x-user-id
  req.headers["x-user-id"] = "test-user";
  next();
});
app.use("/documents", documentRouter);

describe("Document Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /documents", () => {
    it("should return documents", async () => {
      mockDocumentService.getDocuments.mockResolvedValue([
        { id: "1" },
        { id: "2" },
      ]);

      const res = await request(app).get("/documents");

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.documents).toHaveLength(2);
    });
  });

  describe("GET /documents/:id", () => {
    it("should return a document if user has access", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "test-user",
        readAccessUsers: [],
      });

      const res = await request(app).get("/documents/doc1");

      expect(res.status).toBe(200);
      expect(res.body.document).toBeDefined();
    });

    it("should return 403 if user does not have access", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "other-user",
        readAccessUsers: [],
      });

      const res = await request(app).get("/documents/doc1");

      expect(res.status).toBe(403);
    });

    it("should return 404 if document not found", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue(null);

      const res = await request(app).get("/documents/doc404");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /documents", () => {
    it("should create a new document", async () => {
      const mockDoc = { id: "new-doc" };
      mockDocumentService.createDocument.mockResolvedValue(mockDoc);

      const res = await request(app).post("/documents");

      expect(res.status).toBe(201);
      expect(res.body.document).toEqual(mockDoc);
    });
  });

  describe("PATCH /documents/:id", () => {
    it("should update document if user has write access", async () => {
      const updated = { id: "doc1", title: "updated" };

      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "test-user",
        writeAccessUsers: [],
      });
      mockDocumentService.updateDocument.mockResolvedValue(updated);

      const res = await request(app)
        .patch("/documents/doc1")
        .send({ title: "updated" });

      expect(res.status).toBe(200);
      expect(res.body.document).toEqual(updated);
    });

    it("should return 403 if user does not have write access", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "someone-else",
        writeAccessUsers: [],
      });

      const res = await request(app)
        .patch("/documents/doc1")
        .send({ title: "won't update" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /documents/:id", () => {
    it("should delete document if user is owner", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "test-user",
      });
      mockDocumentService.deleteDocument.mockResolvedValue();

      const res = await request(app).delete("/documents/doc1");

      expect(res.status).toBe(204);
    });

    it("should return 403 if user is not owner", async () => {
      mockDocumentService.getDocumentById.mockResolvedValue({
        id: "doc1",
        ownerId: "other-user",
      });

      const res = await request(app).delete("/documents/doc1");

      expect(res.status).toBe(403);
    });
  });
});
