import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    emailWidth: "800",
    fontFamily: {
      serif: ["Georgia", ...defaultTheme.fontFamily.serif],
      sans: [...defaultTheme.fontFamily.sans],
      // probably:
      arial: ["Arial", ...defaultTheme.fontFamily.sans],
      verdana: ["Verdana", ...defaultTheme.fontFamily.sans],
      trebuchet: ["Trebuchet MS", ...defaultTheme.fontFamily.sans],
      georgia: ["Georgia", ...defaultTheme.fontFamily.serif],
      courier: ["Courier New", ...defaultTheme.fontFamily.mono],
      times: ["Times New Roman", ...defaultTheme.fontFamily.serif],
      // maybe:
      lucida: ["Lucida Sans Unicode", ...defaultTheme.fontFamily.sans],
      tahoma: ["Tahoma", ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  // important: true,
  // Core plugins - https://tailwindcss.com/docs/configuration#core-plugins
  // it's not a perfect solution, but it's a start
  corePlugins: [
    // typography
    "fontVariantNumeric",
    "textColor",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "textAlign",
    "textDecoration",
    // sizing
    "width",
    "height",
    "maxWidth",
    "minWidth",
    "maxHeight",
    "minHeight",
    "margin",
    "padding",
    "boxSizing",
    // outline
    "outlineWidth",
    "outlineColor",
    "outlineOffset",
    "outlineStyle",
    // misc
    "opacity",
    "objectFit",
    "objectPosition",
    "overflow",
    "lineHeight",
    "backgroundColor",
    "backgroundSize",
    "backgroundImage",
    "backgroundPosition",
    "borderColor",
    "borderCollapse",
    "borderWidth",
    "borderStyle",
    "borderSpacing",
    "borderOpacity",
    "clear",
    "textWrap",
    "wordBreak",
    "hyphens",
    "space",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "verticalAlign",
  ],
  // corePlugins: {
  //   display: false,
  //   flex: false,
  //   flexBasis: false,
  //   flexDirection: false,
  //   flexGrow: false,
  //   flexShrink: false,
  //   flexWrap: false,
  //   alignItems: false,
  //   alignContent: false,
  //   alignSelf: false,
  //   justifyContent: false,
  //   justifyItems: false,
  //   justifySelf: false,
  // },
  // Static utilities - https://tailwindcss.com/docs/plugins#static-utilities
  plugins: [
    plugin(function ({ addComponents, matchComponents, theme }) {
      /**
       * Custom Tailwind Utilities
       */
      addComponents({
        /**
         * Just for autocomplete
         */
        ".row": {},
        /**
         * Display
         */
        ".block": {
          display: "block",
        },
        ".inline": {
          display: "inline",
        },
        ".inline-block": {
          display: "inline-block",
        },
        ".table": {
          display: "table",
        },
        /**
         * Position
         */
        ".relative": {
          position: "relative",
        },
      });

      /**
       * Dynamic Utilities
       */
      matchComponents(
        {
          col: (modifier) => ({
            width: modifier,
            padding: 0,
            margin: 0,
          }),
        },
        {
          values: {
            1: theme("emailWidth") / 12,
            2: (theme("emailWidth") / 12) * 2,
            3: (theme("emailWidth") / 12) * 3,
            4: (theme("emailWidth") / 12) * 4,
            5: (theme("emailWidth") / 12) * 5,
            6: (theme("emailWidth") / 12) * 6,
            7: (theme("emailWidth") / 12) * 7,
            8: (theme("emailWidth") / 12) * 8,
            9: (theme("emailWidth") / 12) * 9,
            10: (theme("emailWidth") / 12) * 10,
            11: (theme("emailWidth") / 12) * 11,
            12: theme("emailWidth"),
          },
        }
      );
    }),
  ],
};
