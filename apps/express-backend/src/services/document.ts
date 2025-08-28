import { prisma } from "@paper-trail/db";
import type {
  UpdateDocumentInput,
  SlateNodeInput,
} from "../schemas/Document.ts";
import { UpdateDocumentSchema } from "../schemas/Document.ts";

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

const createDocument = async (ownerId: string) => {
  try {
    // Step 1: Create the document + top-level paragraph node
    const doc = await prisma.document.create({
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
              props: {
                textAlign: "left",
                fontFamily: "Arial",
                lineHeight: 1.2,
              },
              order: 0,
            },
          ],
        },
      },
      include: {
        nodes: true,
      },
    });

    const paragraphNode = doc.nodes[0];
    await prisma.node.create({
      data: {
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
        parentId: paragraphNode.id,
        documentId: doc.id,
      },
    });

    return await prisma.document.findUnique({
      where: { id: doc.id },
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

async function createNodesRecursively(
  nodes: SlateNodeInput[],
  documentId: string,
  parentId: string | null = null,
) {
  for (let i = 0; i < nodes.length; i++) {
    const { type, text, children, ...rest } = nodes[i];

    // Create node
    const dbNode = await prisma.node.create({
      data: {
        type: type ?? "text",
        text: text ?? null,
        props: rest ?? {},
        order: i,
        parentId,
        documentId,
      },
    });

    // Recurse if children exist
    if (children && children.length > 0) {
      await createNodesRecursively(children, documentId, dbNode.id);
    }
  }
}

/* ---------------------------------------------
 * Update Document Service
 * -------------------------------------------*/

const updateDocument = async (docId: string, data: UpdateDocumentInput) => {
  try {
    const parsed = UpdateDocumentSchema.parse(data);

    return await prisma.$transaction(async (tx) => {
      // 1. If nodes are provided, replace them
      if (parsed.nodes) {
        await tx.node.deleteMany({ where: { documentId: docId } });
        await createNodesRecursively(parsed.nodes, docId);
      }

      // 2. Update metadata (always)
      await tx.document.update({
        where: { id: docId },
        data: {
          title: parsed.title ?? undefined,
          updatedAt: new Date(),
        },
      });

      // 3. Return fresh doc
      return await tx.document.findUnique({
        where: { id: docId },
        include: {
          nodes: {
            orderBy: { order: "asc" },
            include: { children: { orderBy: { order: "asc" } } },
          },
        },
      });
    });
  } catch (error) {
    console.error("Error updating document:", error);
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
