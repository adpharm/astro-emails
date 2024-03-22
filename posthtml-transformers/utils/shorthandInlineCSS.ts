import posthtml from "posthtml";
// @ts-expect-error no types
import mergeInlineLonghandPlugin from "posthtml-postcss-merge-longhand";

/**
 * Shorthand inline CSS
 * 
 * See usage here: https://maizzle.com/docs/transformers/shorthand-css
 * 
 * @param htmlfile 
 * @returns 
 */
export async function shorthandInlineCSS(htmlfile: string) {
  return posthtml([mergeInlineLonghandPlugin()])
    .process(htmlfile)
    .then((result) => result.html);
}
