import { Client, Account } from "appwrite";

export default defineNuxtPlugin(() => {
  const { endpoint, projectId } = useRuntimeConfig().public.appwrite;
  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  return { provide: { account: new Account(client) } };
});

declare module '#app' {
  interface NuxtApp {
    $account: Account;
  }
}
