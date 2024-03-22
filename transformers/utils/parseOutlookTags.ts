import posthtml from "posthtml";
import mso from "posthtml-mso";

/**
 * Parses content wrapped in <outlook> tags
 *
 * See usage here: https://maizzle.com/docs/tags#outlook
 *
 * @param htmlfile
 * @returns
 */
export async function parseOutlookTags(htmlfile: string) {
  // @ts-expect-error mso is not typed
  return posthtml([mso()])
    .process(htmlfile)
    .then((result) => result.html);
}
