import { defineConfig } from "astro/config";
import astroEmails from "./integrations/astro-emails";

// https://astro.build/config
export default defineConfig({
  integrations: [astroEmails()],
  output: "static",
  outDir: "dist",
  build: {
    format: "file",
    assets: "_assets",
    inlineStylesheets: "always",
    // assetsPrefix: "" // e.g. https://cdn.example.com
  },
  vite: {
    clearScreen: false,
  },
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
});
