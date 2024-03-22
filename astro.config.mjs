import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  build: {
    format: "file",
    assets: "_assets",
    // assetsPrefix: "" // e.g. https://cdn.example.com
  },
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr"],
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
});
