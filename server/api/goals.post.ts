import { GoalInput } from "../utils/goalSchema";

export default defineEventHandler(async (event) => {
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
