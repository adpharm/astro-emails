import posthtml, { type NodeAttributes } from "posthtml";
import { conv } from "color-shorthand-hex-to-six-digit";

/**
 * "Some email clients do not support 3-digit HEX colors like #fff in bgcolor or <font color="">. This Transformer ensures that all your HEX colors inside bgcolor and color attributes are defined with six digits."
 *
 * Ref: https://maizzle.com/docs/transformers/six-hex
 *
 * @param htmlfile
 * @returns
 */
export async function makeSixHex(htmlfile: string) {
  const hexAttributesTargets = new Set(["bgcolor", "color"]);

  return posthtml([
    (tree) => {
      const process: posthtml.NodeCallback = (node) => {
        if (!node.attrs) {
          return node;
        }

        Object.entries(node.attrs).forEach(([name, value]) => {
          if (hexAttributesTargets.has(name) && node.attrs && node.attrs[name]) {
            node.attrs[name] = conv(value);
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
