import type { Request, Response } from "express";
import * as documentService from "../services/document.ts";
import z from "zod";

const getDocuments = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string; //Checked in middleware
  try {
    const documents = await documentService.getDocuments(userId);
    res.status(200).json({ count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

const getDocumentById = async (req: Request, res: Response) => {
  const docId = req.params.id;

  const userId = req.headers["x-user-id"] as string; //Checked in middleware

  try {
    const document = await documentService.getDocumentById(docId);
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const hasReadAccess =
      document.ownerId === userId || document.readAccessUsers.includes(userId);

    if (!hasReadAccess) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createDocument = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string; //Checked in middleware

  try {
    const document = await documentService.createDocument(userId);
    res.status(201).json({ document });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateDocument = async (req: Request, res: Response) => {
  const docId = req.params.id;

  const userId = req.headers["x-user-id"] as string; //Checked in middleware

  const doc = req.body;

  try {
    const document = await documentService.getDocumentById(docId);

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const hasWriteAccess =
      document.ownerId === userId || document.writeAccessUsers.includes(userId);

    if (!hasWriteAccess) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updatedDocument = await documentService.updateDocument(docId, doc);

    res.status(200).json({ document: updatedDocument });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Validation Error", details: error.issues });
      return;
    }
    res.status(500).json({ error: "Failed to update document" });
  }
};

const deleteDocument = async (req: Request, res: Response) => {
  const docId = req.params.id;

  const userId = req.headers["x-user-id"] as string; //Checked in middleware

  try {
    const document = await documentService.getDocumentById(docId);

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    if (document.ownerId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await documentService.deleteDocument(docId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
};

export {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
