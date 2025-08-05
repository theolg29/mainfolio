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
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("jsx-runtime")) {
                return "react-vendor";
              }
              if (id.includes("motion") || id.includes("framer-motion")) {
                return "animation-vendor";
              }
              if (id.includes("lottie")) {
                return "lottie-vendor";
              }
              return "vendor";
            }

            if (id.includes("sections/")) {
              return "sections";
            }

            if (id.includes("scripts/")) {
              return "scripts";
            }
          },
        },
      },
    },
    ssr: {
      noExternal: ["motion", "framer-motion"],
    },
  },
});
