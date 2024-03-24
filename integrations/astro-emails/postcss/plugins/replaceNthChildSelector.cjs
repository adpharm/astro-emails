const { get } = require("lodash");
const postcssParser = require("postcss-selector-parser");

/**
 * Plugin to replace the `nth-child` selectors with custom classes
 *
 * Ref: https://maizzle.com/docs/configuration/tailwindcss#important
 *
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  const widthMapping = {
    1: "100%",
    2: "50%",
    3: "33.3333%",
    4: "25%",
    5: "20%",
    6: "16.6667%",
    7: "14.2857%",
    8: "12.5%",
    9: "11.1111%",
    10: "10%",
    11: "9.0909%",
    12: "8.3333%",
  };

  return {
    postcssPlugin: "replace-nth-child-selectors",

    Rule(rule) {
      // Use postcss-selector-parser to traverse and modify selectors
      rule.selector = postcssParser((selectors) => {
        selectors.walk((classSelector) => {
          if (!classSelector) return;
          const selector = String(classSelector).trim();
          // console.log("sel:", selector);

          console.log("rule", rule);

          if (selector.includes(".col:nth-child(") && selector.includes("):nth-last-child(")) {
            // Extracting the nth-child value from the selector
            const n = selector.match(/\.col:nth-child\((\d+)\):nth-last-child\(\d+\)/)[1];

            // Get the corresponding width value from the mapping
            const width = widthMapping[n];

            // write new "._col-n" selector
            classSelector.replaceWith({ value: `._col-${n}` });

            // Add the width property to the rule
            rule.append({ prop: "width", value: width });
          }
        });
      }).processSync(rule.selector);
    },
  };
};

module.exports.postcss = true;

// Replace the selector with custom class ._col-n
// selector.value = `._col-${n}`;

// Add the width property to the rule
// rule.append({ prop: "width", value: width });
