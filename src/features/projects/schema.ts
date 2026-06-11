import { z } from "zod";

const trimmedString = z.string().trim();

export const projectSchema = z.object({
  name: trimmedString
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: trimmedString
    .min(1, "Description cannot be empty")
    .max(500, "Description must be under 500 characters")
    .optional(),
  progress: z.coerce.number().min(0).max(100),
  status: z.enum(["planned", "active", "blocked", "completed"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
