import type { H3Event } from "h3";

export function getApiBaseUrl(event: H3Event): string {
  const { apiBaseUrl } = useRuntimeConfig(event);
  if (!apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server misconfigured: NUXT_API_BASE_URL is not set",
    });
  }
  return apiBaseUrl;
}
