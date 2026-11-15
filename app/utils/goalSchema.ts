import { z } from "zod";

export const GoalInput = z.object({
  name: z.string().trim().min(1, { message: "Goal name is required" }),
  target: z.number().gt(0, { message: "Amount must be greater than $0" }),
  deadline: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Enter a valid date" })
      .nullable()
      .optional(),
  ),
});

export const DepositInput = z.object({
  amount: z.number().gt(0, { message: "Amount must be greater than $0" }),
  note: z.string().optional(),
});

export const DepositSchema = z.object({
  id: z.string(),
  amount: z.number(),
  note: z.string(),
  createdAt: z.string(),
});

export const DepositsSchema = z.array(DepositSchema);
