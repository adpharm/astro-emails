#!ts-node

import type { OptionalConfig, RequiredConfig } from "tailwindcss/types/config";
import resolveConfig from "tailwindcss/resolveConfig.js";
import defaultTheme from "tailwindcss/defaultTheme.js";
import defaultColors from "tailwindcss/colors.js";
import * as prettier from "prettier";
import * as fs from "fs";
import path from "path";
import tailwindConfig from "tailwind.config.ts";

// tailwind config
// const twConfig = twConfig as Partial<RequiredConfig> & Partial<OptionalConfig>;
const twConfig = resolveConfig(tailwindConfig);

/**
 * Get all the colors from the themes
 *
 * @returns { [key: string]: string }
 */
function getTwColorClasses() {
  /**
   * Get all the colors from the themes
   */

  // remove deprecated colors from defaultColors
  // @ts-expect-error df
  delete defaultColors.lightBlue;
  // @ts-expect-error df
  delete defaultColors.coolGray;
  // @ts-expect-error df
  delete defaultColors.trueGray;
  // @ts-expect-error df
  delete defaultColors.warmGray;
  // @ts-expect-error df
  delete defaultColors.blueGray;

  // merge colors from defaultTheme and twConfig
  const colors = {
    ...defaultColors,
    // TODO: this probably won't work if we use fancy functions in the tailwind.config.js
    // e.g. colors: (theme) => ({ ... }) ... a problem for another day
    ...(twConfig.theme?.colors || {}),
  };

  // this will be { "slate-200": "#xxxxxx", .... }
  const twColorClasses: {
    [key: string]: string;
  } = {};

  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === "string") {
      twColorClasses[colorName] = colorValue;
    } else {
      Object.entries(colorValue).forEach(([shade, value]) => {
        twColorClasses[`${colorName}-${shade}`] = value;
      });
    }
  });

  return twColorClasses;
}

/**
 * Create border classes
 * @returns
 */
function generateBorderClasses() {
  /**
   * Get all the colors from the themes
   */
  const twColorClasses = getTwColorClasses();

  /**
   * Get all the border-widths from the themes
   */
  const twBorderWidths: {
    [key: string]: string;
  } = {
    ...defaultTheme.borderWidth,
    ...(twConfig.theme?.borderWidth || {}),
  };

  /**
   * Get all the border-style from the themes
   */
  const twBorderStyles = {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    double: "double",
  };

  /**
   * Get border options
   */
  const twBorderSides = {
    t: "top",
    r: "right",
    b: "bottom",
    l: "left",
    DEFAULT: "",
  };

  /**
   * Put it all together
   * We want an object like:
   * {
   *  "border-solid-red-500": "border: 1px solid #XXXXXX",
   *  "border-2-dashed-blue-500": "border: 2px dashed #XXXXXX",
   *  ...
   * }
   */
  const twBorderClasses: {
    [key: string]: {
      border?: string;
      "border-left"?: string;
      "border-right"?: string;
      "border-top"?: string;
      "border-bottom"?: string;
    };
  } = {};

  Object.entries(twBorderSides).forEach(([sideKey, sideValue]) => {
    Object.entries(twBorderWidths).forEach(([widthKey, widthValue]) => {
      Object.entries(twColorClasses).forEach(([colorKey, colorValue]) => {
        Object.entries(twBorderStyles).forEach(([styleKey, styleValue]) => {
          // TODO: should default be "" or "1"?
          let twClass = `.border${sideKey !== "DEFAULT" ? `-${sideKey}` : ""}${widthKey !== "DEFAULT" ? `-${widthKey}` : ""}${
            styleKey !== "solid" ? `-${styleKey}` : ""
          }-${colorKey}`;

          if (widthKey !== "0") {
            twBorderClasses[twClass] = {
              [sideValue ? `border-${sideValue}` : "border"]: `${widthValue} ${styleValue} ${colorValue}`,
            };
          }
        });
      });
    });
  });

  return twBorderClasses;
}

async function writeStaticFile(outputFile: string, content: string) {
  const fileContent = `// This file is generated automatically by tailwind-utils/generateBorderClasses.ts
// Do not edit this file directly.
// To regenerate this file, run:
//   npm run script -- ${path.relative(process.cwd(), process.argv[1])}
// 

${content}
`;

  //  format the content
  const formattedContent = await prettier.format(fileContent, { parser: "typescript" });

  // write the content to the file
  fs.writeFileSync(outputFile, formattedContent);
}

(async function () {
  /**
   * Generate border classes
   */
  console.time("generateBorderClasses");
  await writeStaticFile(
    "./tailwind-utils/output/_generatedBorderClasses.ts",
    `
  export const borderClasses = ${JSON.stringify(generateBorderClasses(), null, 2)};
  `
  );
  console.timeEnd("generateBorderClasses");

  /**
   * Save twColorClasses to a file
   */
  console.time("getTwColorClasses");
  await writeStaticFile(
    "./tailwind-utils/output/_generatedColorClasses.ts",
    `
  export const colorClasses = ${JSON.stringify(Object.keys(getTwColorClasses()), null, 2)};
  `
  );
  console.timeEnd("getTwColorClasses");

  console.log("\nDone!");
})();
