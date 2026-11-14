export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return;
  const { user, fetchUser } = useAuth();
  const current = user.value ?? (await fetchUser());
  if (!current) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }
});
