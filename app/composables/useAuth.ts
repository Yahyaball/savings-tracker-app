import type { Models } from "appwrite";

export function useAuth() {
  const { $account } = useNuxtApp();
  const user = useState<Models.User<Models.Preferences> | null>(
    "auth-user",
    () => null,
  );
  const ready = useState("auth-ready", () => false);

  const fetchUser = async () => {
    if (!import.meta.client) return null;
    try {
      user.value = await $account.get();
    } catch {
      user.value = null;
    } finally {
      ready.value = true;
    }
    return user.value;
  };

  const logout = async () => {
    try {
      await $account.deleteSession({ sessionId: "current" });
    } catch {
      // session may already be expired
    } finally {
      user.value = null;
      await navigateTo("/login");
    }
  };
  return { user, ready, fetchUser, logout };
}
