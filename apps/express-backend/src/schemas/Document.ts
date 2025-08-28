import { z } from "zod";

export const TextAlignEnum = z.enum(["left", "center", "right", "justify"]);

export const NodePropsSchema = z.record(z.string(), z.any());

export const NodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.cuid().optional(),
    type: z.string(),                  
    text: z.string().nullable().optional(),
    props: NodePropsSchema.default({}),
    parentId: z.string().nullable().optional(),
    order: z.number(),
    children: z.array(NodeSchema).optional(),
    documentId: z.string(),           
  })
);

export const DocumentSchema = z.object({
  id: z.cuid().optional(),
  title: z.string().default("Untitled Document"),
  nodes: z.array(NodeSchema).default([]),
  ownerId: z.string(),
  readAccessUsers: z.array(z.string()).default([]),
  writeAccessUsers: z.array(z.string()).default([]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const SlateNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    text: z.string().nullable().optional(),
    props: NodePropsSchema.default({}),
    order: z.number().optional(),
    children: z.array(SlateNodeSchema).optional(),
  })
);

export const UpdateDocumentSchema = z.object({
  title: z.string().optional(),
  nodes: z.array(SlateNodeSchema).optional(),
});

export const PartialDocumentSchema = DocumentSchema.partial();

export type TextAlign = z.infer<typeof TextAlignEnum>;
export type DocumentType = z.infer<typeof DocumentSchema>;
export type PartialDocumentType = z.infer<typeof PartialDocumentSchema>

export type SlateNodeInput = z.infer<typeof SlateNodeSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;
