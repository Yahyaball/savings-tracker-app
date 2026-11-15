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
      script:
        process.env.NODE_ENV === "production"
          ? []
          : [
              {
                innerHTML: `!function(){var c=globalThis.crypto;if(c&&typeof c.randomUUID!=="function"&&typeof c.getRandomValues==="function"){Object.defineProperty(c,"randomUUID",{configurable:true,value:function(){var b=c.getRandomValues(new Uint8Array(16));b[6]=b[6]&15|64;b[8]=b[8]&63|128;var h=Array.prototype.map.call(b,function(x){return x.toString(16).padStart(2,"0")}).join("");return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20)}})}}();`,
              },
            ],
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
  routeRules: {
    "/": { ssr: false },
    "/goals/**": { ssr: false },
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      appwrite: {
        endpoint: process.env.APPWRITE_ENDPOINT,
        projectId: process.env.APPWRITE_PROJECT_ID,
        projectName: process.env.APPWRITE_PROJECT_NAME,
        databaseId: process.env.APPWRITE_DATABASE_ID,
        goalsTableId: process.env.APPWRITE_GOALS_TABLE_ID,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
