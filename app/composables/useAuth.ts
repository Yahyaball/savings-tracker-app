import type { Models } from "appwrite";

let fetchPromise: Promise<Models.User<Models.Preferences> | null> | null = null;

export function useAuth() {
  const { $account } = useNuxtApp();
  const user = useState<Models.User<Models.Preferences> | null>(
    "auth-user",
    () => null,
  );

  const fetchUser = async () => {
    if (!import.meta.client) return null;
    if (fetchPromise) return fetchPromise;
    fetchPromise = (async () => {
      try {
        user.value = await $account.get();
      } catch {
        user.value = null;
      }
      return user.value;
    })().finally(() => {
      fetchPromise = null;
    });
    return fetchPromise;
  };

  const logout = async () => {
    try {
      await $account.deleteSession({ sessionId: "current" });
    } catch {
      // session may already be expired
    } finally {
      user.value = null;
      clearNuxtData("goals");
      await navigateTo("/login");
    }
  };

  const updateName = async (name: string) => {
    user.value = await $account.updateName({ name });
  };

  const updateEmail = async (email: string, password: string) => {
    user.value = await $account.updateEmail({ email, password });
  };

  const updatePassword = async (password: string, oldPassword: string) => {
    user.value = await $account.updatePassword({ password, oldPassword });
  };

  const initials = computed(() => {
    const name = user.value?.name?.trim();
    if (name) return name.charAt(0).toUpperCase();
    return user.value?.email?.charAt(0).toUpperCase() ?? "";
  });
  const displayName = computed(() => {
    const name = user.value?.name?.trim();
    if (name) return name.trim();
    return user.value?.email?.trim() ?? "";
  });
  const email = computed(() => {
    const email = user.value?.email?.trim();
    if (email) return email;
    return "";
  });
  return {
    user,
    displayName,
    fetchUser,
    logout,
    initials,
    email,
    updateName,
    updateEmail,
    updatePassword,
  };
}
