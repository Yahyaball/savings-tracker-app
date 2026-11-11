export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const goals = await $fetch<{ id: string }[]>(config.apiBaseUrl);
  return goals.map((g) => ({ ...g, id: toPublicId(g.id) }));
});
