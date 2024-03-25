import { colorClasses } from "tailwind-utils/output/_generatedColorClasses";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";

const tailwindConfigResolved = resolveConfig(tailwindConfig);

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

function popWithDefault<T>(arr: string[], value: string | RegExp, defaultValue: T | string): T | string {
  const result = pop(arr, value);

  if (result === "") {
    return defaultValue;
  }

  return result as unknown as T;
}

/**
 * Extracts a tailwind class from a given class list
 *
 * @param classList
 * @param classToExtract
 */
export function extractFromClassList<T = string>(
  classList: string[],
  classToExtract:
    | "bg-url"
    | "bg-color"
    | "width"
    | "height"
    | "margin"
    | "text-align"
    | "border-color"
    | "padding"
    | "font-size"
    | "border-radius",
  defaultValue: T | string = ""
): T | string {
  switch (classToExtract) {
    case "width":
      // width regex is w-<size>
      return popWithDefault(classList, /^w-/, defaultValue);

    case "height":
      // height regex is h-<size>
      return popWithDefault(classList, /^h-/, defaultValue);

    case "margin":
      // margin regex is m-<size>, mx-<size>, my-<size>, mt-<size>, mr-<size>, mb-<size>, ml-<size>
      return popWithDefault(classList, /^m(?:x|y|t|r|b|l)?-/, defaultValue);

    case "padding":
      // padding regex is p-<size>, px-<size>, py-<size>, pt-<size>, pr-<size>, pb-<size>, pl-<size>
      return popWithDefault(classList, /^p(?:x|y|t|r|b|l)?-/, defaultValue);

    case "text-align":
      // text-align regex is text-<left | center | right>
      return popWithDefault(classList, /^text-(?:left|center|right)/, defaultValue);

    case "bg-url":
      // bg image regex is bg-[url('<url>')] (quotes could be single or double)
      return popWithDefault(classList, /^bg-\[url\(['"](.*)['"]\)\]/, defaultValue);

    case "bg-color":
      // colorClasses is an array of all the color classes (e.g. slate-50, gray-100, inherit, etc.)
      // bg color regex is bg-<color>
      return popWithDefault(classList, new RegExp(`^bg-(${colorClasses.join("|")})`), defaultValue);

    case "border-color":
      // colorClasses is an array of all the color classes (e.g. slate-50, gray-100, inherit, etc.)
      // border color regex is border-<color>
      // TODO: this isn't going to work - we need to match the border color with the border width and style
      return popWithDefault(classList, new RegExp(`^border-(${colorClasses.join("|")})`), defaultValue);

    case "border-radius":
      // border radius regex is rounded-<size>
      return popWithDefault(classList, /^rounded-/, defaultValue);

    case "font-size":
      // font size regex is an array of all font-size identifiers (e.g. xxs, xs, etc.)
      const fontSizeIds = Object.keys(tailwindConfigResolved.theme.fontSize);
      return popWithDefault(classList, new RegExp(`^text-(${fontSizeIds.join("|")})`), defaultValue);

    default:
      return defaultValue;
  }
}

interface Sides {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Given a string like "px-4 py-2", we want to extract an object like { left: 4, right: 4, top: 2, bottom: 2 }
 *
 * @param paddingClass
 * @returns
 */
export function extractValueFromPaddingClass(paddingClass: string): Sides {
  const paddingIndividualClasses = paddingClass.split(" ");
  const padding = { top: 0, right: 0, bottom: 0, left: 0 };

  paddingIndividualClasses.forEach((classname) => {
    const [direction, amount] = classname.split("-");
    let value = parseInt(amount, 10);
    if (amount === "px") {
      value = 1;
    }

    // convert to px
    // @ts-expect-error weird config type
    const valuePx = tailwindConfigResolved.theme.spacing[`${value}`] || value * 4;

    if (direction === "p") {
      padding.top = valuePx;
      padding.right = valuePx;
      padding.bottom = valuePx;
      padding.left = valuePx;
    } else if (direction === "px") {
      padding.top = valuePx;
      padding.bottom = valuePx;
    } else if (direction === "py") {
      padding.top = valuePx;
      padding.bottom = valuePx;
    } else if (direction === "pt") {
      padding.top = valuePx;
    } else if (direction === "pr") {
      padding.right = valuePx;
    } else if (direction === "pb") {
      padding.bottom = valuePx;
    } else if (direction === "pl") {
      padding.left = valuePx;
    }
  });

  return padding;
}

/**
 * Given a string like "text-xs", we want to extract the font size in px
 *
 * @param fontSizeClass
 * @returns
 */
export function extractValueFromFontSizeClass(fontSizeClass: string): number {
  const fontSizeClasses = fontSizeClass.split(" ");

  const defaultSizePx = tailwindConfigResolved.theme.fontSize.base || "16px";

  let fontSize = parseInt(defaultSizePx.replace("px", ""), 10);

  fontSizeClasses.forEach((classname) => {
    const [_, size] = classname.split("-");

    // @ts-expect-error weird config type
    const val = tailwindConfigResolved.theme.fontSize[size] || "16px";

    // strip the px
    fontSize = val ? parseInt(val.replace("px", ""), 10) : fontSize;
  });

  return fontSize;
}

/**
 * Given a string like "rounded-md", we want to extract the border radius in px
 *
 * @param borderRadiusClass
 * @returns
 */
export function extractValueFromBorderRadiusClass(borderRadiusClass: string): number {
  const borderRadiusClasses = borderRadiusClass.split(" ");

  const defaultRadiusPx = tailwindConfigResolved.theme.borderRadius.none || "0px";

  let borderRadius = parseInt(defaultRadiusPx.replace("px", ""), 10);

  borderRadiusClasses.forEach((classname) => {
    const [_, size] = classname.split("-");

    // @ts-expect-error weird config type
    const val = tailwindConfigResolved.theme.borderRadius[size] || "0px";

    // strip the px
    borderRadius = val ? parseInt(val.replace("px", ""), 10) : borderRadius;
  });

  return borderRadius;
}

/**
 * Given a string like "w-64", we want to extract the width in px
 *
 * @param widthClass
 * @returns
 */
export function extractValueFromWidthClass(widthClass: string): number {
  const widthClasses = widthClass.split(" ");

  const defaultWidthPx = tailwindConfigResolved.theme.width.auto || "auto";

  let width = parseInt(defaultWidthPx.replace("px", ""), 10);

  widthClasses.forEach((classname) => {
    const [_, size] = classname.split("-");

    const val = tailwindConfigResolved.theme.width[size] || "auto";

    // strip the px
    width = val ? parseInt(val.replace("px", ""), 10) : width;
  });

  return width;
}

/**
 * Given a string like "h-64", we want to extract the height in px
 *
 * @param heightClass
 * @returns
 */
export function extractValueFromHeightClass(heightClass: string): number {
  const heightClasses = heightClass.split(" ");

  const defaultHeightPx = tailwindConfigResolved.theme.height.auto || "auto";

  let height = parseInt(defaultHeightPx.replace("px", ""), 10);

  heightClasses.forEach((classname) => {
    const [_, size] = classname.split("-");

    const val = tailwindConfigResolved.theme.height[size] || "auto";

    // strip the px
    height = val ? parseInt(val.replace("px", ""), 10) : height;
  });

  return height;
}
