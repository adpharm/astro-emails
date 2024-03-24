const { get } = require("lodash");

/**
 * Plugin to add `!important` to all declarations in Tailwind variants
 *
 * Ref: https://maizzle.com/docs/configuration/tailwindcss#important
 *
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  // Work with options here

  return {
    postcssPlugin: "add-important-to-tw-variants",

    Rule(rule) {
      const shouldAddImportant =
        get(rule, "raws.tailwind.layer") === "variants" || get(rule, "parent.type") === "atrule";

      if (shouldAddImportant) {
        rule.walkDecls((decl) => {
          decl.important = true;
        });
      }
    },
  };
};

module.exports.postcss = true;
