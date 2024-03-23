import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  build: {
    format: "file",
    assets: "_assets",
    inlineStylesheets: "always",
    // assetsPrefix: "" // e.g. https://cdn.example.com
  },
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       plugins
  //     }
  //   }
  // },
  // vite: {
  //   server: {
  //     watch: {

  //     }
  //   },
  //   build: {
  //     rollupOptions: {}
  //   }
  // },
  // cacheDir: "./posthtml-transformers/.astro",
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr"],
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
});
