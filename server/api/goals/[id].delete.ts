import { getApiBaseUrl } from "~~/server/utils/apiBaseUrl";

export default defineEventHandler(async (event) => {
  const publicId = getRouterParam(event, "id");
  if (!publicId)
    throw createError({ statusCode: 400, statusMessage: "Missing goal id" });
  const rawId = fromPublicId(publicId);
  const apiBaseUrl = getApiBaseUrl(event);
  const deleted = await $fetch<{ id: string }>(`${apiBaseUrl}/${rawId}`, {
    method: "DELETE",
  });
  return { ...deleted, id: toPublicId(deleted.id) };
});
