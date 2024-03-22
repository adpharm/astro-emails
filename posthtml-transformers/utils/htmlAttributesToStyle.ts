import posthtml from "posthtml";
// @ts-expect-error no types
import parseAttrs from "posthtml-attrs-parser";
import _ from "lodash";

/**
 * Duplicate HTML attributes to inline CSS.
 *
 * See usage here: https://maizzle.com/docs/transformers/attribute-to-style
 *
 * @param htmlfile
 * @returns
 */
export async function htmlAttributesToStyle(htmlfile: string) {
  const attributes = ["width", "height", "bgcolor", "background", "align", "valign"];

  return posthtml([
    (tree) => {
      const process: posthtml.NodeCallback = (node) => {
        if (!node.attrs) {
          return node;
        }

        const nodeAttributes = parseAttrs(node.attrs) as Record<string, any>;
        const matches = _.intersection(Object.keys(nodeAttributes), attributes);
        const nodeStyle = _.get(node.attrs, "style");
        const cssToInline: string[] = [];

        matches.forEach((attribute) => {
          let value = _.get(node.attrs, attribute);

          switch (attribute) {
            case "bgcolor":
              cssToInline.push(`background-color: ${value}`);
              break;

            case "background":
              cssToInline.push(`background-image: url('${value}')`);
              break;

            case "width":
              value = Number.parseInt(value, 10) + (value.match(/px|%/) || "px");
              cssToInline.push(`width: ${value}`);
              break;

            case "height":
              value = Number.parseInt(value, 10) + (value.match(/px|%/) || "px");
              cssToInline.push(`height: ${value}`);
              break;

            case "align":
              if (node.tag !== "table") {
                return cssToInline.push(`text-align: ${value}`);
              }

              if (["left", "right"].includes(value)) {
                cssToInline.push(`float: ${value}`);
              }

              if (value === "center") {
                cssToInline.push("margin-left: auto", "margin-right: auto");
              }

              break;

            case "valign":
              cssToInline.push(`vertical-align: ${value}`);
              break;

            // No default
          }
        });

        nodeAttributes.style = nodeStyle ? `${nodeStyle} ${cssToInline.join("; ")}` : `${cssToInline.join("; ")}`;

        node.attrs = nodeAttributes.compose();

        return node;
      };

      return tree.walk(process);
    },
  ])
    .process(htmlfile)
    .then((result) => result.html);
}
