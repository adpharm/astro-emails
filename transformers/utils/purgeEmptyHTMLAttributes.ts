import posthtml from "posthtml";
import _ from "lodash";

/**
 * Removes empty attributes
 *
 * See usage here: https://maizzle.com/docs/transformers/remove-attributes
 *
 * @param htmlfile
 * @returns
 */
export async function purgeEmptyHTMLAttributes(htmlfile: string) {
  const defaultAttributesToPurge = ["style", "class"];

  return posthtml([
    (tree) => {
      const process: posthtml.NodeCallback = (node) => {
        if (!node.attrs) {
          return node;
        }

        defaultAttributesToPurge.forEach((attr) => {
          if (!node.attrs) {
            return node;
          }

          const targetAttrValue = _.get(node.attrs, attr);

          if (typeof targetAttrValue === "boolean" || targetAttrValue === "") {
            // remove empty attributes
            delete node.attrs[attr];
          }
        });

        return node;
      };

      return tree.walk(process);
    },
  ])
    .process(htmlfile)
    .then((result) => result.html);
}
