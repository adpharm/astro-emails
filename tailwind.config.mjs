import { tailwindStrictConfig } from "./tailwind.config.01strict.ts";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindStrictConfig,
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
};
