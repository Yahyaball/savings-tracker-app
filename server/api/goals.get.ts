import { getApiBaseUrl } from "../utils/apiBaseUrl";

export default defineEventHandler(async (event) => {
  const apiBaseUrl = getApiBaseUrl(event);
  const goals = await $fetch<{ id: string }[]>(apiBaseUrl);
  return goals.map((g) => ({ ...g, id: toPublicId(g.id) }));
});
