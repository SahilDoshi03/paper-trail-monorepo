import { prisma, type Prisma } from "@paper-trail/db";
import type { PartialDocumentType } from "../schemas/Document.ts";

// Get all documents for an owner
const getDocuments = async (ownerId: string) => {
  try {
    return await prisma.document.findMany({
      where: { ownerId },
      include: {
        nodes: {
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Get single document by ID
const getDocumentById = async (id: string) => {
  try {
    return await prisma.document.findUnique({
      where: { id },
      include: {
        nodes: {
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error getting document with id ${id}:`, error);
    throw error;
  }
};

// Create a new document with one empty paragraph node
const createDocument = async (ownerId: string) => {
  try {
    return await prisma.document.create({
      data: {
        title: "Untitled Document",
        ownerId,
        readAccessUsers: [],
        writeAccessUsers: [],
        nodes: {
          create: [
            {
              type: "paragraph",
              text: null,
              props: { textAlign: "left", fontFamily: "Arial", lineHeight: 1.2 },
              order: 0,
              children: {
                create: [
                  {
                    type: "text",
                    text: "",
                    props: {
                      color: "#ffffff",
                      fontSize: 16,
                      bold: false,
                      italic: false,
                      underline: false,
                      backgroundColor: "transparent",
                    },
                    order: 0,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        nodes: {
          orderBy: { order: "asc" },
          include: { children: { orderBy: { order: "asc" } } },
        },
      },
    });
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

// Recursive helper to convert Slate JSON → Prisma create structure
const mapSlateNodeToPrisma = (node: any, index: number): Prisma.NodeCreateWithoutDocumentInput => {
  const { type, text, children, ...rest } = node;
  return {
    type,
    text: text ?? null,
    props: rest || {},
    order: index,
    children: {
      create: (children ?? []).map(mapSlateNodeToPrisma),
    },
  };
};

// Update document (replace all nodes)
const updateDocument = async (id: string, doc: PartialDocumentType) => {
  try {
    const { nodes, ...restFields } = doc;

    const data: Partial<Prisma.DocumentUpdateInput> = {};

    for (const [key, value] of Object.entries(restFields)) {
      if (value !== undefined) {
        data[key as keyof typeof restFields] = value;
      }
    }

    if (nodes && nodes.length > 0) {
      // Delete existing tree
      await prisma.node.deleteMany({
        where: { documentId: id },
      });

      // Recreate tree
      data.nodes = {
        create: nodes.map(mapSlateNodeToPrisma),
      };
    }

    if (Object.keys(data).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    return await prisma.document.update({
      where: { id },
      data,
      include: {
        nodes: {
          orderBy: { order: "asc" },
          include: { children: { orderBy: { order: "asc" } } },
        },
      },
    });
  } catch (error) {
    console.error(`Error updating document with id ${id}:`, error);
    throw error;
  }
};

// Delete document and all its nodes
const deleteDocument = async (documentId: string) => {
  try {
    await prisma.node.deleteMany({
      where: { documentId },
    });

    await prisma.document.delete({
      where: { id: documentId },
    });
  } catch (error) {
    console.error(`Error deleting document with id ${documentId}:`, error);
    throw error;
  }
};

export {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
