import juice from "juice";

/**
 * Inlines CSS in the HTML file
 *
 * See usage here (only basic, default stuff right now): https://maizzle.com/docs/transformers/inline-css
 *
 * @param htmlfile
 * @returns
 */
export async function inlineCSS(htmlfile: string) {
  juice.excludedProperties = ["--tw-shadow"];
  return juice(htmlfile, { removeStyleTags: false });
}
