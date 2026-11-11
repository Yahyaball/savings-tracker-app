import { z } from "zod";

export default defineEventHandler(async (event) => {
  const GoalInput = z.object({
    name: z.string().min(1, { message: "Goal name is required" }),
    target: z.number().gt(0, { message: "Amount must be greater than $0" }),
    deadline: z.string().nullable().optional(),
  });
  const body = await readValidatedBody(event, GoalInput.parse);
  const config = useRuntimeConfig(event);
  const created = await $fetch<{ id: string }>(config.apiBaseUrl, {
    method: "POST",
    body: {
      ...body,
      deposits: [],
      createdAt: new Date().toISOString(),
    },
  });
  return { ...created, id: toPublicId(created.id) };
});
