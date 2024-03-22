import { glob } from "glob";
import { readFile, writeFile } from "fs/promises";
import { shorthandInlineCSS } from "./utils/shorthandInlineCSS.ts";
import { addAttributes } from "./utils/addAttributes.ts";
import { htmlAttributesToStyle } from "./utils/htmlAttributesToStyle.ts";
import { inlineCSS } from "./utils/inlineCSS.ts";
import { makeSafeClasses } from "./utils/makeSafeClasses.ts";
import { makeSixHex } from "./utils/makeSixHex.ts";
import { parseOutlookTags } from "./utils/parseOutlookTags.ts";
import { minifyHTML } from "./utils/minifyHTML.ts";
import { purgeEmptyHTMLAttributes } from "./utils/purgeEmptyHTMLAttributes.ts";
import { purgeCSS } from "./utils/purgeCSS.ts";

/**
 * Our custom build
 */
export async function transformHTML() {
  /**
   * Get all html files
   */
  const globPath = process.argv[2] || "dist/**/*.html";
  // glob
  const files = await glob(globPath);

  for (const file of files) {
    let html = await readFile(file, "utf-8");

    /**
     * process file
     */
    html = await makeSafeClasses(html);
    html = await htmlAttributesToStyle(html);
    html = await inlineCSS(html);
    html = await shorthandInlineCSS(html);
    html = await addAttributes(html);
    html = await purgeCSS(html);
    html = await purgeEmptyHTMLAttributes(html);
    html = await makeSixHex(html);
    html = await parseOutlookTags(html);
    html = await minifyHTML(html);

    /**
     * Write file
     */
    await writeFile(file, html, "utf-8");
  }
}
