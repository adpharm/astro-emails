import { defineConfig } from "astro/config";
// import tailwind from "@astrojs/tailwind";
import { emailhtml } from "./rollup-plugin-html/index";
import Inspect from "vite-plugin-inspect";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  output: "static",
  // outDir: "_site",
  build: {
    format: "file",
    assets: "_assets",
    inlineStylesheets: "always",
    // assetsPrefix: "" // e.g. https://cdn.example.com
  },
  vite: {
    // plugins: [Inspect()],
    // plugins: [
    //   {
    //     ...emailhtml(),
    //     enforce: "post",
    //   },
    // ],
    plugins: [emailhtml()],
    // build: {
    //   rollupOptions: {
    //     plugins
    //   }
    // }
    clearScreen: false,
    // build: {
    //   watch: {
    //     // include: ["dist/**/*.html"],
    //     // clearScreen: false,
    //   },
    // },

    // build: {
    //   rollupOptions: {
    //     input: {
    //       template: "./dist/index.html",
    //     },
    //   },
    // },
  },
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
