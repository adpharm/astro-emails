/**
 * Removes widow words from the html file
 *
 * See usage here: https://maizzle.com/docs/transformers/widows
 *
 * @param htmlfile
 * @returns
 */
// export async function removeWidowWords(htmlfile: string) {
//   // return removeWidows(htmlfile).res;
//   const attrName = "no-widows";

//   // TODO: do I need this plugin? idk
//   return posthtml([
//     (tree) => {
//       const process: posthtml.NodeCallback = (node) => {
//         if (node.attrs && Object.keys(node.attrs).includes(attrName)) {
//           const widowsRemovedString = removeWidows(tree.render(node.content), removeWidowsOptions).res;

//           node.content = tree.render(tree.parser(widowsRemovedString));
//           node.attrs[attrName] = false;
//         }

//         return node;
//       };

//       return tree.walk(process);
//     },
//   ])
//     .process(htmlfile)
//     .then((result) => result.html);
// }
