// @ts-expect-error no types
import safeClassNames from "posthtml-safe-class-names";
import posthtml from "posthtml";
import _ from "lodash";

/**
 * Uses posthtml-safe-class-names to make sure that class names are safe
 *
 * Refs:
 *   - https://github.com/posthtml/posthtml-safe-class-names/tree/master
 *
 * @param htmlfile
 * @returns
 */
export async function makeSafeClasses(htmlfile: string) {
  const whitelist = {
    "{": "{",
    "}": "}",
  };
  return posthtml([safeClassNames({ replacements: whitelist })])
    .process(htmlfile)
    .then((result) => result.html);
}
