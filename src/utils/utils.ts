import { colorClasses } from "tailwind-utils/output/_generatedColorClasses";

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
  classToExtract: "bg-url" | "bg-color" | "width" | "margin" | "text-align",
  defaultValue: T | string = ""
): T | string {
  switch (classToExtract) {
    case "width":
      // width regex is w-<size>
      const w = popWithDefault(classList, /^w-/, defaultValue);
    // return popWithDefault(classList, /^w-/, defaultValue);

    case "margin":
      // margin regex is m-<size>, mx-<size>, my-<size>, mt-<size>, mr-<size>, mb-<size>, ml-<size>
      return popWithDefault(classList, /^m(?:x|y|t|r|b|l)?-/, defaultValue);

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

    default:
      return defaultValue;
  }
}
