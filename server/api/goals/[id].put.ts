import { getApiBaseUrl } from "~~/server/utils/apiBaseUrl";
import { GoalInput } from "~~/server/utils/goalSchema";

export default defineEventHandler(async (event) => {
  const publicId = getRouterParam(event, "id");
  if (!publicId)
    throw createError({ statusCode: 400, statusMessage: "Missing goal id" });
  const rawId = fromPublicId(publicId);
  const body = await readValidatedBody(event, GoalInput.parse);
  const apiBaseUrl = getApiBaseUrl(event);
  type StoredGoal = {
    createdAt: string;
    deposits: { id: string; amount: number; note: string; createdAt: string }[];
  };
  const existing = await $fetch<StoredGoal>(`${apiBaseUrl}/${rawId}`);
  const updated = await $fetch<{ id: string }>(`${apiBaseUrl}/${rawId}`, {
    method: "PUT",
    body: {
      ...body,
      createdAt: existing.createdAt,
      deposits: existing.deposits,
    },
  });
  return { ...updated, id: toPublicId(updated.id) };
});
