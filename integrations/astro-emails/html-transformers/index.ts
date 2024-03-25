import { glob } from "glob";
import path from "node:path";
import { readFile, writeFile } from "fs/promises";
import { shorthandInlineCSS } from "./shorthandInlineCSS.ts";
import { addAttributes } from "./addAttributes.ts";
import { htmlAttributesToStyle } from "./htmlAttributesToStyle.ts";
import { inlineCSS } from "./inlineCSS.ts";
import { makeSafeClasses } from "./makeSafeClasses.ts";
import { makeSixHex } from "./makeSixHex.ts";
import { parseOutlookTags } from "./parseOutlookTags.ts";
import { minifyHTML } from "./minifyHTML.ts";
import { purgeEmptyHTMLAttributes } from "./purgeEmptyHTMLAttributes.ts";
import { purgeCSS } from "./purgeCSS.ts";
import { injectHMRScript } from "./injectHMRScript.ts";

/**
 * Make HTML email friendly
 *
 * @param dir
 */
export async function emailifyHtml(dir: string) {
  await forEachHtmlFile(dir, async (html) => {
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

    // TODO:???
    // set width of table with id="_root" such that it is max-width: 

    return html;
  });
}

/**
 * Injects HMR script to handle hot-reloading of HTML files
 *
 * @param dir
 */
export async function injectHMRInHtml(dir: string) {
  await forEachHtmlFile(dir, injectHMRScript);
}

async function forEachHtmlFile(dir: string, cb: (html: string) => Promise<string>) {
  /**
   * Get all html files
   */
  let files: string[] = [];

  if (dir.endsWith(".html")) {
    files.push(dir);
  } else {
    const globPath = dir.endsWith("/") ? `${dir}**/*.html` : `${dir}/**/*.html`;

    // glob
    files = await glob(globPath);
  }

  for (const file of files) {
    let html = await readFile(file, "utf-8");

    /**
     * process file
     */
    html = await cb(html);

    /**
     * Write file
     */
    await writeFile(file, html, "utf-8");
  }
}
