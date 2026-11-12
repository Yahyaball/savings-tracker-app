import { z } from "zod";

export const GoalInput = z.object({
  name: z.string().trim().min(1, { message: "Goal name is required" }),
  target: z.number().gt(0, { message: "Amount must be greater than $0" }),
  deadline: z.string().nullable().optional(),
});
