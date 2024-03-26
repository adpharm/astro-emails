import { colorClasses } from "tailwind-utils/output/_generatedColorClasses";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import type { StandardPropertiesHyphen } from "csstype";
import { distStyles } from "@/assets/__styles-dist";

const tailwindConfigResolved = resolveConfig(tailwindConfig);

type CssProperties = Exclude<keyof StandardPropertiesHyphen, "border-color" | "border-style" | "border-width">;

/**
 * Pop stuff from the string or array, mutating the original
 * @param src
 * @param value
 * @returns
 */
export function pop(arr: string[], value: string | RegExp): string {
  if (value instanceof RegExp) {
    // the regex version is a bit more complex, since we need to find all matching classes and remove them
    const matches = arr.filter((c) => value.test(c));
    matches.forEach((m) => {
      const index = arr.indexOf(m);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    });

    return matches.join(" ").trim();
  }

  const index = arr.indexOf(value);
  if (index !== -1) {
    const returnVal = arr.splice(index, 1)[0].trim();

    return returnVal;
  }

  return "";
}

/**
 * Get the value of a CSS property for a given class
 *
 * @example
 * findTailwindClassForCssProperty("max-width", "max-w-screen bg-gray-100 rounded-md p-4")
 * // => ["max-w-screen", "bg-gray-100 rounded-md p-4"]
 *
 * @param property
 * @param classStr
 * @returns [string, string]
 */
export function findTailwindClassForCssProperty(property: CssProperties, classStr: string): [string, string] {
  const twClass =
    classStr
      .split(" ")
      .map((c) => c.trim())
      .findLast((c) => {
        const cssDeclarationObj = distStyles[`.${c}` as keyof typeof distStyles] || {};
        return Object.keys(cssDeclarationObj).some((key) => key === property);
      }) || "";

  // remove the class from the class string
  const newClassStr = classStr.replace(twClass, "").trim();

  // return the class and the new class string
  return [twClass, newClassStr];
}

/**
 * Get the value of a CSS property for a given class
 *
 * @example
 * findValueForCssProperty("max-width", "max-w-screen bg-gray-100 rounded-md p-4")
 * // => "100vw"
 *
 * @param property
 * @param classStr
 * @returns
 */
export function findValueForCssProperty(property: CssProperties, classStr: string): string | null {
  const [twClass] = findTailwindClassForCssProperty(property, classStr);

  if (twClass.length === 0) return null;

  const cssDeclarationObj = distStyles[`.${twClass}` as keyof typeof distStyles];
  for (const [key, val] of Object.entries(cssDeclarationObj)) {
    if (key === property) {
      if (!val) return null;
      const str = `${val}`.trim();

      return str;
    }
  }

  return null;
}

/**
 * Get the value of a CSS property in px for a given class
 *
 * @example
 * findValueInPxForCssProperty("max-width", "max-w-screen bg-gray-100 rounded-md p-4")
 * // => "100vw"
 *
 * @param property
 * @param classStr
 * @returns
 */
export function findValueInPxForCssProperty(property: CssProperties, classStr: string): number | null {
  const value = findValueForCssProperty(property, classStr);
  if (!value) return null;

  return calcPx(value);
}

/**
 * Find the URL for a CSS property
 *
 * @example
 * findUrlForCssProperty("background-image", "bg-[url('https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg')]")
 * // => "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
 *
 * @param property
 * @param classStr
 * @returns
 */
export function findUrlForCssProperty(property: "background-image", classStr: string): string | null {
  const [twClass] = findTailwindClassForCssProperty(property, classStr);

  if (twClass.length === 0) return null;

  const cssDeclarationObj = distStyles[`.${twClass}` as keyof typeof distStyles];
  for (const [key, val] of Object.entries(cssDeclarationObj)) {
    if (key === property) {
      if (!val) return null;
      const str = `${val}`.trim();

      // get the value inside the [url('...')], which may appear anywhere in the string
      const urlRegex = /\[url\('(.*)'\)\]/;
      const match = urlRegex.exec(str);
      if (!match) return null;

      return match[1];
    }
  }

  return null;
}

/**
 * Find the border value for a CSS property
 *
 * @example
 * findBorderValueForCssProperty("border-top", "border-t-2-gray-200")
 * // => { width: "2px", style: "solid", color: "#e5e7eb" }
 *
 * @param property
 * @param classStr
 * @returns
 */
export function findBorderValueForCssProperty(
  property: "border-top" | "border-right" | "border-bottom" | "border-left" | "border",
  classStr: string
): {
  width: string | null;
  style: string | null;
  color: string | null;
} {
  const _default = { width: null, style: null, color: null };
  const [twClass] = findTailwindClassForCssProperty(property, classStr);

  if (twClass.length === 0) return _default;

  const cssDeclarationObj = distStyles[`.${twClass}` as keyof typeof distStyles];
  for (const [key, val] of Object.entries(cssDeclarationObj)) {
    if (key === property) {
      if (!val) return _default;
      const str = `${val}`.trim();

      const parts = str.split(" ");
      const width = parts[0];
      const style = parts[1];
      const color = parts[2];

      return { width, style, color };
    }
  }

  return _default;
}

/**
 * Calculate the value in px from a string
 *
 * @example
 * calcPx("16px")
 * // => 16
 * calcPx("50vw")
 * // => 350
 *
 * @param value
 * @returns
 */
export function calcPx(value: string): number {
  if (value.endsWith("px")) {
    return parseInt(value.replace("px", ""), 10);
  }

  if (value.endsWith("vw") || value.endsWith("%")) {
    const screenWidth = parseInt(tailwindConfigResolved.theme.screens.sm.max.replace("px", ""), 10);
    return (parseInt(value.replace("vw", "").replace("%", ""), 10) / 100) * screenWidth;
  }

  if (value.endsWith("rem")) {
    return parseInt(value.replace("rem", ""), 10) * 16;
  }

  if (value.endsWith("em")) {
    return parseInt(value.replace("em", ""), 10) * 16;
  }

  return 0;
}
