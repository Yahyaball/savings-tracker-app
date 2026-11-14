export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) return;
  const { user, fetchUser } = useAuth();
  const current = user.value ?? (await fetchUser());
  if (current) {
    return navigateTo("/");
  }
});
