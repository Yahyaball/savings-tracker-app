import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      title: "Savings Tracker",
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@vueuse/nuxt/module",
    "@formkit/auto-animate/nuxt",
    "motion-v/nuxt",
  ],
  motionV: {
    directives: true,
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    public: {
      appwrite: {
        endpoint: process.env.APPWRITE_ENDPOINT,
        projectId: process.env.APPWRITE_PROJECT_ID,
        projectName: process.env.APPWRITE_PROJECT_NAME,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
