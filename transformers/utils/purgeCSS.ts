import { comb } from "email-comb";
import posthtml from "posthtml";
import postcss from "postcss";
// @ts-expect-error no types
import parseAttrs from "posthtml-attrs-parser";
import matchHelper from "posthtml-match-helper";
import _ from "lodash";

/**
 * Remove unused CSS, both inlined and in <style> tags
 *
 * See usage here: https://maizzle.com/docs/transformers/remove-unused-css
 *
 * @param htmlfile
 * @returns
 */
export async function purgeCSS(htmlfile: string) {
  const safelist = [
    "*body*", // Gmail
    ".gmail*", // Gmail
    ".apple*", // Apple Mail
    ".ios*", // Mail on iOS
    ".ox-*", // Open-Xchange
    ".outlook*", // Outlook.com
    "[data-ogs*", // Outlook.com
    ".bloop_container", // Airmail
    ".Singleton", // Apple Mail 10
    ".unused", // Notes 8
    ".moz-text-html", // Thunderbird
    ".mail-detail-content", // Comcast, Libero webmail
    "*edo*", // Edison (all)
    "#*", // Freenet uses #msgBody
    ".lang*", // Fenced code blocks
  ];

  const htmlWithoutInlinedSelectors = await purgeInlineClasses(htmlfile, safelist);

  return comb(htmlWithoutInlinedSelectors, {
    // options from: https://maizzle.com/docs/transformers/remove-unused-css#backend
    backend: [
      { heads: "{{", tails: "}}" },
      { heads: "{%", tails: "%}" },
    ],
  }).result;
}

async function purgeInlineClasses(htmlfile: string, safelist: string[] = []) {
  return posthtml([
    (tree) => {
      const process: posthtml.NodeCallback = (node) => {
        if (!node.attrs) {
          return node;
        }

        if (node.tag !== "style") return node;
        if (!node.content) return node;

        // For each style tag...
        const { root } = postcss().process(node.content);
        const preservedClasses: string[] = [];

        // Preserve selectors in at rules
        root.walkAtRules((rule) => {
          if (["media", "supports"].includes(rule.name)) {
            rule.walkRules((rule) => {
              preservedClasses.push(rule.selector);
            });
          }
        });

        root.walkRules((rule) => {
          const { selector } = rule;
          const prop = _.get(rule.nodes[0], "prop", "");

          // Preserve pseudo selectors
          if (selector.includes(":")) {
            preservedClasses.push(selector);
          }

          try {
            // If we find the selector in the HTML...
            tree.match(matchHelper(selector), (n) => {
              // If the selector is safelisted, preserve it
              if (safelist.some((item) => item.endsWith(selector) || item.startsWith(selector))) {
                preservedClasses.push(selector);
                return n;
              }

              const parsedAttrs = parseAttrs(n.attrs);
              const classAttr: string[] = _.get(parsedAttrs, "class", []);
              const styleAttr = _.get(parsedAttrs, "style", {});

              // If the class is in the style attribute (inlined), remove it
              if (_.has(styleAttr, prop)) {
                // Remove the class as long as it's not a preserved class
                if (!preservedClasses.some((item) => item.endsWith(selector) || item.startsWith(selector))) {
                  _.remove(classAttr, (classToRemove) => selector.includes(classToRemove));
                }

                // Remove the rule in the <style> tag
                if (rule.parent?.type !== "atrule") {
                  rule.remove();
                }
              }

              n.attrs = parsedAttrs.compose();

              // Fix issue with .compose() automatically quoting attributes with no values
              Object.entries(n.attrs || {}).forEach(([name, value]) => {
                // if (value === "" && _.get(options.posthtml, "recognizeNoValueAttribute") === true) {
                if (value === "") {
                  // @ts-expect-error not sure about this one
                  n.attrs[name] = true;
                }
              });

              return n;
            });
          } catch {}
        });

        // node.content = root.toString().trim();
        node.content = [root.toString().trim()];

        // Remove <style> tag if it ends up empty after processing
        if ((node.content?.length || 0) === 0) {
          node.tag = undefined;
        }

        return node;
      };

      return tree.walk(process);
    },
  ])
    .process(htmlfile)
    .then((result) => result.html);
}
