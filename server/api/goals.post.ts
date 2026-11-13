import { getApiBaseUrl } from "../utils/apiBaseUrl";
import { GoalInput } from "../utils/goalSchema";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, GoalInput.parse);
  const apiBaseUrl = getApiBaseUrl(event);
  const created = await $fetch<{ id: string }>(apiBaseUrl, {
    method: "POST",
    body: {
      ...body,
      deposits: [],
      createdAt: new Date().toISOString(),
    },
  });
  return { ...created, id: toPublicId(created.id) };
});
