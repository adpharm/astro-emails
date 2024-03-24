import posthtml from "posthtml";
import addAttributesPlugin from "posthtml-extra-attributes";

/**
 * Adds attributes
 *
 * See usage here: https://maizzle.com/docs/transformers/add-attributes
 *
 * @param htmlfile
 * @returns
 */
export async function addAttributes(htmlfile: string) {
  const defaultAttributes = {
    table: {
      align: "center",
      border: 0,
      cellpadding: 0,
      cellspacing: 0,
      role: "none", // or "presentation" ??
    },
    img: {
      alt: "",
    },
  };

  // @ts-expect-error addAttributesPlugin is not typed
  return posthtml([addAttributesPlugin({ attributes: defaultAttributes })])
    .process(htmlfile)
    .then((result) => result.html);
}
