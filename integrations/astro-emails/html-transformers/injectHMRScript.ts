import posthtml, { type NodeAttributes } from "posthtml";
import { conv } from "color-shorthand-hex-to-six-digit";

/**
 * Injects HMR script to handle hot-reloading of HTML files
 *
 * Refs:
 *  - https://github.com/vitejs/vite/discussions/7740
 *  - https://vitejs.dev/guide/api-plugin.html#handlehotupdate
 *
 * @param htmlfile
 * @returns
 */
export async function injectHMRScript(htmlfile: string) {
  return posthtml([
    (tree) => {
      // const process: posthtml.NodeCallback = (node) => {
      //   // Inject HMR script
      //   if (node.tag === "head") {
      //     node.content?.push({
      //       tag: "script",
      //       attrs: {
      //         type: "module",
      //         src: "/@vite/client",
      //       },
      //     });
      //   }
      // };

      // return tree.walk(process);

      tree.match({ tag: "head" }, (node) => {
        const scriptTag = {
          tag: "script",
          attrs: {
            type: "module",
            src: "/@vite/client",
          },
        };

        // check if our script tag already exists
        const existingScriptTag = node.content?.some(
          (n) => typeof n !== "string" && n.tag === "script" && n.attrs?.src === "/@vite/client"
        );

        if (existingScriptTag) {
          return node;
        }

        // @ts-expect-error missing walk, match (probably just mis-typed)
        node.content?.unshift(scriptTag);
        return node;
      });
      return tree;
    },
  ])
    .process(htmlfile)
    .then((result) => result.html);
}
