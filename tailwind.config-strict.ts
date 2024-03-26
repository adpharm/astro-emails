import defaultTheme from "tailwindcss/defaultTheme.js";
import plugin from "tailwindcss/plugin.js";
import type { RequiredConfig, OptionalConfig, CustomThemeConfig, Config } from "tailwindcss/types/config";
// @ts-expect-error this is a JS import
import tailwindMso from "tailwindcss-mso";
import { borderClasses } from "./tailwind-utils/output/_generatedBorderClasses.ts";

/**
 * This is the strict theme, which will give you the most
 * consistency over every major email client and device.
 *
 * All other themes are based on this one.
 */
export const tailwindStrictConfig = {
  content: [],
  theme: {
    screens: {
      // NOTE: ordering matters here!!
      // sm: { min: "0px" },
      // lg: { min: "426px" },

      // NOTE: this is what maizzle does (desktop-first)
      // lg: { max: "700px" },
      // sm: { max: "425px" },

      // NOTE: this is what tailwind does (mobile-first)
      sm: { max: "700px" },
      lg: { min: "701px" },
    },
    spacing: {
      screen: "100vw",
      full: "100%",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      4.5: "18px",
      5: "20px",
      5.5: "22px",
      6: "24px",
      6.5: "26px",
      7: "28px",
      7.5: "30px",
      8: "32px",
      8.5: "34px",
      9: "36px",
      9.5: "38px",
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
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "24px",
      full: "999px",
    },
    fontFamily: {
      // sensible defaults
      serif: ["Georgia", "Times New Roman", "Lucida Bright", ...defaultTheme.fontFamily.serif],
      sans: ["Arial", "Verdana", "Trebuchet MS", "Tahoma", ...defaultTheme.fontFamily.sans],
      mono: ["Courier New", "Lucida Sans Typewriter", "Consolas", ...defaultTheme.fontFamily.mono],

      // source: https://www.cssfontstack.com/
      /**
       * SANS // ex: Font (Mac, Win)
       */
      // Both Mac and Win:
      // Arial (99, 98)
      // Arial Black (98, 96)
      // Verdana (99, 99)
      // Trebuchet MS (97, 99)
      // Tahoma (91, 99)
      // Gill Sans (95, 58)

      // Mac only:
      // Helvetica (100, 7)
      // Lucida Grande (100, 0)
      // Optima (93, 2)
      // Geneva (99, 2)
      // Impact (95, 0)
      // Futura (94, 1)

      // Windows only:
      // Franklin Gothic Medium (0, 99)
      // Segoe UI (0, 75)

      /**
       * SERIF // ex: Font (Mac, Win)
       */
      // Both Mac and Win:
      // Times New Roman (97, 99)
      // Georgia (97, 99)
      // Lucida Bright (99, 76)
      // Palatino (86, 99)
      // Baskerville (93, 60)
      // Book Antiqua (49, 86)
      // Garamond (49, 86)
      // Cambria (35, 83)

      // Mac only:
      // Big Caslon (92, 0)
      // Didot (93, 0)
      // Hoefler Text (92, 0)

      // Windows only:
      // Perpetua (0, 66)
      // Rockwell (0, 65)
      // Rockwell Extra Bold (0, 66)

      /**
       * MONO // ex: Font (Mac, Win)
       */
      // Both Mac and Win:
      // Courier New (95, 99)
      // Lucida Sans Typewriter (99, 75)
      // Consolas (34, 82)

      // Mac only:
      // Monaco (99, 2)
      // Andale Mono (95, 4)

      // Windows only:
      // Lucida Console (0, 99)

      /**
       * FANTASY // ex: Font (Mac, Win)
       */
      // Both Mac and Win:
      // Copperplate (92, 67)
      // Papyrus (92, 70)
    },
    fontSize: {
      0: "0",
      xxs: "11px",
      xs: "12px",
      "2xs": "13px",
      sm: "14px",
      "2sm": "15px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "60px",
      "7xl": "72px",
      "8xl": "96px",
      "9xl": "128px",
    },
    letterSpacing: ({ theme }) => ({
      ...theme("width"),
    }),
    lineHeight: ({ theme }) => ({
      ...theme("width"),
    }),
    maxWidth: ({ theme }) => ({
      ...theme("width"),
      xs: "160px",
      sm: "192px",
      md: "224px",
      lg: "256px",
      xl: "288px",
      "2xl": "336px",
      "3xl": "384px",
      "4xl": "448px",
      "5xl": "512px",
      "6xl": "576px",
      "7xl": "640px",
    }),
    minHeight: ({ theme }) => ({
      ...theme("width"),
    }),
    minWidth: ({ theme }) => ({
      ...theme("width"),
    }),
    // border: ({ theme }) => {
    //   const borderWidths = {
    //     0: "0",
    //     1: "1px",
    //     2: "2px",
    //     4: "4px",
    //     8: "8px",
    //   };
    //   const borderColors = theme("colors") as Record<string, string>;
    //   const borderStyles = {
    //     solid: "solid",
    //     dashed: "dashed",
    //     dotted: "dotted",
    //     double: "double",
    //     hidden: "hidden",
    //     none: "none",
    //   };

    //   // combine all the possible combinations
    //   const borders = Object.keys(borderWidths).flatMap((width) => {
    //     return Object.keys(borderColors).flatMap((color) => {
    //       return Object.keys(borderStyles).map((style) => {
    //         return `${width} ${style} ${color}`;
    //       });
    //     });
    //   });

    //   // the names should be like
    //   // "border-solid-black", "border-2-solid-red-500", etc.
    //   return borders.reduce((acc, border) => {
    //     const [width, style, color] = border.split(" ");

    //     let name = `border-${width}-${style}-${color}`;
    //     // if width is 1, we can remove it
    //     if (width === "1") {
    //       name = `border-${style}-${color}`;
    //     }

    //     return {
    //       ...acc,
    //       [name]: border,
    //     };
    //   }, {});
    // },
  },
  // Core plugins - https://tailwindcss.com/docs/configuration#core-plugins
  // it's not a perfect solution, but it's a start
  corePlugins: [
    // "display",
    // typography
    "fontVariantNumeric",
    "textColor",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "textAlign",
    "textDecoration",
    "textTransform",
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
    // "borderColor",
    // "borderCollapse",
    // "borderWidth",
    // "borderStyle",
    // "borderSpacing",
    // // "borderOpacity",
    "borderRadius",
    "clear",
    "textWrap",
    "wordBreak",
    // "hyphens",
    // "space",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "verticalAlign",
  ],
  plugins: [
    // Adding base styles (instead of using CSS stylesheets)
    plugin(function ({ addBase, theme }) {
      addBase({
        // Default html styles
        html: {
          fontFamily: theme("fontFamily.sans", defaultTheme.fontFamily.sans),
        },
        // Default body styles
        body: {
          margin: "0",
          padding: "0",
          width: "100%",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontWeight: "400",
          webkitFontSmoothing: "antialiased",
          wordBreak: "break-word",
          webkitTextSizeAdjust: "100%",
          msTextSizeAdjust: "100%",
          webkitBoxSizing: "border-box",
          mozBoxSizing: "border-box",
          boxSizing: "border-box",
        },
        // Default text styles
        h1: { fontSize: theme("fontSize.4xl") },
        h2: { fontSize: theme("fontSize.3xl") },
        h3: { fontSize: theme("fontSize.xl") },
        p: { fontWeight: "400" },
        // Image styles
        img: {
          maxWidth: "100%",
          verticalAlign: "middle",
          lineHeight: "1",
        },
      });
    }),
    // Adding some sudo-custom utilities
    plugin(function ({ addComponents, theme }) {
      addComponents({
        // Display
        ".block": {
          display: "block",
        },
        ".inline": {
          display: "inline",
        },
        ".inline-block": {
          display: "inline-block",
        },
        ".table-cell": {
          display: "table-cell",
        },
        ".hidden": {
          display: "none",
        },
        // insert borders here
        ...borderClasses,
      });
    }),
    // MSO utilities
    // from https://github.com/maizzle/tailwindcss-mso/blob/master/src/index.js
    tailwindMso,
    // Email variants plugin
    // from https://github.com/maizzle/tailwindcss-email-variants/blob/main/src/index.js
    plugin(function ({ addVariant }) {
      // Outlook.com dark mode
      addVariant("ogsc", "[data-ogsc] &");
      addVariant("ogsb", "[data-ogsb] &");

      // Gmail (webmail)
      addVariant("gmail", "u + .body &");

      // Gmail (Android)
      addVariant("gmail-android", "div > u + .body &");

      // Apple Mail
      addVariant("apple-mail", ".Singleton &");

      // iOS Mail 10+
      addVariant("ios", "@supports (-webkit-overflow-scrolling:touch) and (color:#ffff)");

      // iOS Mail 15+
      addVariant("ios-15", "@supports (-webkit-overflow-scrolling:touch) and (aspect-ratio: 1 / 1)");

      // Open-Xchange (multiple clients)
      addVariant("ox", '&[class^="ox-"]');
    }),
  ],
} satisfies Config;
