const { get } = require("lodash");

/**
 * Plugin to add align to table elements when text-align is set
 *
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  // Work with options here

  return {
    postcssPlugin: "align-table-elements",

    Rule(rule) {
      const shouldAddAlign = get(rule, "raws.tailwind.layer") === "base" || get(rule, "parent.type") === "atrule";

      if (shouldAddAlign) {
        rule.walkDecls((decl) => {
          if (decl.prop === "text-align") {
            const tableElements = ["table", "tr", "th", "td"];

            if (tableElements.includes(rule.selector)) {
              rule.walkDecls((decl) => {
                decl.value = `${decl.value}; display: block;`;
              });
            }
          }
        });
      }
    },
  };
};

module.exports.postcss = true;
