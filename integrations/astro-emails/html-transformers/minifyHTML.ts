import { crush } from "html-crush";

/**
 * Shorthand inline CSS
 *
 * See usage here: https://maizzle.com/docs/transformers/shorthand-css
 *
 * @param htmlfile
 * @returns
 */
export async function minifyHTML(htmlfile: string) {
  return crush(htmlfile, {
    removeLineBreaks: true,
    removeIndentations: true,
    lineLengthLimit: 500,
  }).result;
}
