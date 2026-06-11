import { z } from "zod";

const trimmedString = z.string().trim();

export const taskSchema = z.object({
  project_id: trimmedString.min(1, "Project ID is required"),
  title: trimmedString
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .refine((value) => !/^"+$/.test(value), {
      message: "Title cannot contain only double quotes",
    }),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  estimate_hours: z.coerce.number().min(0).max(1000).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
