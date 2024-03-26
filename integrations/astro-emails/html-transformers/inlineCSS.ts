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

  // juice.tableElements = ["TABLE", "TH", "TR", "CAPTION", "COLGROUP", "COL", "THEAD", "TBODY", "TFOOT"];

  return juice(htmlfile, { applyAttributesTableElements: true, removeStyleTags: false });
}
