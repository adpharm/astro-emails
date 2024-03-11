import type { CustomThemeConfig, OptionalConfig, PluginCreator, RequiredConfig } from "tailwindcss/types/config";
import { tailwindStrictConfig } from "./01-strict";
import plugin from "tailwindcss/plugin";

/**
 *
 */
export const tailwindModernConfig: Partial<RequiredConfig> & Partial<OptionalConfig> = {
  ...tailwindStrictConfig,
  theme: {
    ...tailwindStrictConfig.theme,
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    },
  },
  corePlugins: [...(Array.isArray(tailwindStrictConfig.corePlugins) ? tailwindStrictConfig.corePlugins : [])],
  plugins: [
    ...(Array.isArray(tailwindStrictConfig.plugins) ? tailwindStrictConfig.plugins : []),
    // Box shadow plugin
    // from https://github.com/maizzle/tailwindcss-box-shadow/blob/master/src/index.js
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          shadow: (val) => ({
            boxShadow: val,
          }),
        },
        {
          values: theme("boxShadow"),
        }
      );
    }),
  ],
};
