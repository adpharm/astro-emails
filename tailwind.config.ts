import type { Config } from "tailwindcss/types/config";
import { tailwindStrictConfig } from "./tailwind.config-strict.ts";

export default {
  ...tailwindStrictConfig,
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
} satisfies Config;
