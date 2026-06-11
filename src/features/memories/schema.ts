import { z } from "zod";

const trimmedString = z.string().trim();
const noProjectSentinelValues = new Set(["", "null", "NULL"]);

const projectIdSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalizedValue = value.trim();
    if (noProjectSentinelValues.has(normalizedValue)) {
      return null;
    }
    return normalizedValue;
  }

  return value;
}, z.union([z.string().uuid("Invalid project id"), z.null()]));

export const memorySchema = z.object({
  project_id: projectIdSchema,
  memory_type: z.enum(["note", "decision", "insight", "meeting"]),
  content: trimmedString
    .min(1, "Content is required")
    .min(4, "Content must be at least 4 characters"),
  importance: z.coerce.number().min(1).max(10),
});

export const memoryFilterSchema = z.object({
  memory_type: z.enum(["all", "note", "decision", "insight", "meeting"]),
});

export type MemoryFormValues = z.infer<typeof memorySchema>;
