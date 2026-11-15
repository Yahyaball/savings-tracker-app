import { Client, Account, TablesDB } from "appwrite";

export default defineNuxtPlugin(() => {
  const { endpoint, projectId } = useRuntimeConfig().public.appwrite;

  if (!endpoint || !projectId) {
    throw new Error(
      "Appwrite is not configured. Set NUXT_PUBLIC_APPWRITE_ENDPOINT and NUXT_PUBLIC_APPWRITE_PROJECT_ID in your hosting environment, then redeploy.",
    );
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  return {
    provide: { account: new Account(client), tables: new TablesDB(client) },
  };
});

declare module '#app' {
  interface NuxtApp {
    $account: Account;
    $tables: TablesDB;
  }
}
