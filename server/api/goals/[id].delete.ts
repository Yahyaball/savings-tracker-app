export default defineEventHandler(async (event) => {
  const publicId = getRouterParam(event, "id");
  if (!publicId)
    throw createError({ statusCode: 400, statusMessage: "Missing goal id" });
  const rawId = fromPublicId(publicId);
  const config = useRuntimeConfig(event);
  const deleted = await $fetch<{ id: string }>(
    `${config.apiBaseUrl}/${rawId}`,
    { method: "DELETE" },
  );
  return { ...deleted, id: toPublicId(deleted.id) };
});
