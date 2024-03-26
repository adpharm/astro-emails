import posthtml from "posthtml";
import _ from "lodash";
import { removeWidows } from "string-remove-widows";

/**
 * Removes widow words
 *
 * See usage here: https://maizzle.com/docs/transformers/widows#prevent-widow-words
 *
 * @param htmlfile
 * @returns
 */
export async function purgeWidowWords(htmlfile: string) {
  const attrName = "no-widow";
  const altAttrName = "no-widows";
  // Ignore defaults
  const mappings = [
    // Jinja-like
    {
      heads: "{{",
      tails: "}}",
    },
    {
      heads: ["{% if", "{%- if"],
      tails: ["{% endif", "{%- endif"],
    },
    {
      heads: ["{% for", "{%- for"],
      tails: ["{% endfor", "{%- endfor"],
    },
    {
      heads: ["{%", "{%-"],
      tails: ["%}", "-%}"],
    },
    {
      heads: "{#",
      tails: "#}",
    },
    // ASP/Hexo-like
    {
      heads: ["<%", "<%=", "<%-"],
      tails: ["%>", "=%>", "-%>"],
    },
    // MSO comments
    {
      heads: "<!--[",
      tails: "]>",
    },
    // <![endif]-->
    {
      heads: "<![",
      tails: "]--><",
    },
  ];

  return posthtml([
    (tree) => {
      const process: posthtml.NodeCallback = (node) => {
        if (!node.attrs) {
          return node;
        }

        if (Object.keys(node.attrs).includes(attrName) || Object.keys(node.attrs).includes(altAttrName)) {
          // console.log("Removing widows from:", node.content);
          if (!node.content) return node;

          // @ts-expect-error no tree.render
          const widowsRemovedString = removeWidows(tree.render(node.content), {
            ignore: mappings,
          }).res;

          // @ts-expect-error no tree.parser
          node.content = tree.render(tree.parser(widowsRemovedString));
          // node.content = [widowsRemovedString];
          delete node.attrs[attrName];
        }

        return node;
      };

      return tree.walk(process);
    },
  ])
    .process(htmlfile)
    .then((result) => result.html);
}
