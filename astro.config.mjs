// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import playformCompress from "@playform/compress";
import sitemap from "@astrojs/sitemap";
import lottie from "astro-integration-lottie";

// https://astro.build/config
export default defineConfig({
  site: "https://theolegourrierec.fr",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    playformCompress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
    sitemap(),
    lottie(),
  ],
  output: "static",
  adapter: vercel(),
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssCodeSplit: false,
    },
    ssr: {
      noExternal: ["motion", "framer-motion"],
    },
  },
});
