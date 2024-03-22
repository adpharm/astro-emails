/**
 * PostCSS configuration file
 */
module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("./postcss-plugins/importantTailwindVariants.cjs"),
    // require("cssnano"), // we don't need this because we minify the html file
  ],
};
