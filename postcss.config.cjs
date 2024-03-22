const postcssParser = require("postcss-selector-parser");

/**
 * PostCSS configuration file
 */
module.exports = {
  plugins: [
    require("postcss-import"),
    // require("./postcss-plugins/replaceNthChildSelector.cjs"),
    
    // postcssParser((selectors) => {
    //   selectors.walkClasses((classSelector) => {
        
    //     // classSelector.value = classSelector.value.replace(/\.col:nth-child\(1\):nth-last-child\(2\)/g, ".first-col");
    //     // classSelector.value = classSelector.value.replace(/\.col:nth-child\(2\):nth-last-child\(1\)/g, ".second-col");
    //   });
    // }),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("./postcss-plugins/importantTailwindVariants.cjs"),
    require("cssnano"),
  ],
};
