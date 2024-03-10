import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    emailWidth: "800",
    fontFamily: {
      serif: ["Georgia", ...defaultTheme.fontFamily.serif],
      sans: ["Arial", ...defaultTheme.fontFamily.sans],
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
    fontSize: {
      xxs: ["12px", { lineHeight: "16px" }],
      xs: ["14px", { lineHeight: "20px" }],
      sm: ["16px", { lineHeight: "24px" }],
      base: ["18px", { lineHeight: "28px" }],
      lg: ["20px", { lineHeight: "28px" }],
      xl: ["24px", { lineHeight: "32px" }],
      "2xl": ["30px", { lineHeight: "36px" }],
      "3xl": ["36px", { lineHeight: "36px" }],
      "4xl": ["48px", { lineHeight: "1" }],
      "5xl": ["60px", { lineHeight: "1" }],
      "6xl": ["72px", { lineHeight: "1" }],
      "7xl": ["96px", { lineHeight: "1" }],
      "8xl": ["144px", { lineHeight: "1" }],
      "9xl": ["192px", { lineHeight: "1" }],
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
    },
    maxWidth: ({ theme, breakpoints }) => ({
      none: "none",
      0: "0px",
      xs: "320px",
      sm: "384px",
      md: "448px",
      lg: "512px",
      xl: "576px",
      "2xl": "672px",
      "3xl": "768px",
      "4xl": "896px",
      "5xl": "1024px",
      "6xl": "1152px",
      "7xl": "1280px",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      prose: "65ch",
      ...breakpoints(theme("screens")),
    }),
    spacing: {
      px: "1px",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
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
    // "space",
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
        // ".relative": {
        //   position: "relative",
        // },
      });

      /**
       * Dynamic Utilities
       */
      // matchComponents(
      //   {
      //     col: (modifier) => ({
      //       width: modifier,
      //       padding: 0,
      //       margin: 0,
      //     }),
      //   },
      //   {
      //     values: {
      //       1: theme("emailWidth") / 12,
      //       2: (theme("emailWidth") / 12) * 2,
      //       3: (theme("emailWidth") / 12) * 3,
      //       4: (theme("emailWidth") / 12) * 4,
      //       5: (theme("emailWidth") / 12) * 5,
      //       6: (theme("emailWidth") / 12) * 6,
      //       7: (theme("emailWidth") / 12) * 7,
      //       8: (theme("emailWidth") / 12) * 8,
      //       9: (theme("emailWidth") / 12) * 9,
      //       10: (theme("emailWidth") / 12) * 10,
      //       11: (theme("emailWidth") / 12) * 11,
      //       12: theme("emailWidth"),
      //     },
      //   }
      // );
    }),
  ],
};
