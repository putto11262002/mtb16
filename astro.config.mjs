// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [
    react(),
    sentry({
      project: "mtb16",
      org: "put-suthisrisinlpa",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});

