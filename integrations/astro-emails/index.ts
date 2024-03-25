import { build as buildAstro, type AstroIntegration } from "astro";
import path from "node:path";
import colors from "picocolors";
import serveStatic from "serve-static";
import { normalizePath, type HmrContext, type PluginOption } from "vite";
import { glob } from "glob";
import { $, fs, within } from "zx";
import { emailifyHtml, injectHMRInHtml } from "./html-transformers";
import css from "css";
// import { convert } from "@americanexpress/css-to-js";

interface AstroEmailsIntegrationOptions {
  /**
   * Paths to watch for changes.
   * @default config.build.outDir
   */
  input: string | string[];
  /**
   * Files will be resolved against this path.
   * @default process.cwd()
   */
  root?: string;
}

export default function createAstroEmailsIntegration(options?: AstroEmailsIntegrationOptions): AstroIntegration {
  return {
    name: "astro-emails",
    hooks: {
      "astro:config:setup": ({ updateConfig, isRestart, logger }) => {
        if (isRestart) return;

        updateConfig({
          vite: {
            plugins: [vitePluginAstroEmailsHMR()],
          },
        });
      },

      /**
       * Setup the server
       */
      "astro:server:setup": async ({ server, logger }) => {
        const { input = `${server.config.build.outDir}/**/*.html`, root = server.config.root } = options || {};
        const paths = normalizePaths(root, input);

        /**
         * Redirect requests to .html
         */
        server.middlewares.use(async (req, res, next) => {
          // if no url, skip
          if (!req.url) return next();
          // if url ends with .html already, skip
          if (req.url?.endsWith(".html")) return next();

          // get file paths relative to config.build.outDir and remove .html extension
          const files = (await glob(paths)).map((_path) =>
            path.relative(server.config.build.outDir, _path).replace(/\.html$/, "")
          );

          const reqUrlFilename = path.basename(req.url);

          /**
           * Check if the request is for an input file
           */
          const isAnInputFileRequest = files.some((file) => reqUrlFilename === file);

          /**
           *
           */
          if (req.url === "/") {
            req.url = "/index.html";
            return next();
          }

          if (isAnInputFileRequest) {
            logger.info(`${colors.green("[email matching]")} ${colors.dim(`${req.url} -> ${req.url}${".html"}`)}`);

            req.url += ".html";
          }

          return next();
        });

        /**
         * Serve the dist directory
         */
        server.middlewares.use(serveStatic(server.config.build.outDir));
      },

      "astro:build:start": async ({ logger }) => {
        const workingDir = process.cwd();
        logger.info("Prepping build...");
        const prepLogger = logger.fork("astro-emails/prep");

        prepLogger.info("Transforming CSS...");
        await within(async () => {
          $.verbose = false;
          // const workingDir = (await $`pwd`).stdout.trim();
          await $`postcss ${workingDir}/src/assets/_styles.css -o ${workingDir}/src/assets/__styles-dist.css`;
        });

        prepLogger.info("Building CSS objects...");
        // convert(`${workingDir}/src/assets/__styles-dist.css`, {
        //   outputType: "file",
        //   outputPath: `${workingDir}/src/assets/__styles-dist.js`,
        // });

        const cssContent = await fs.readFile(`${workingDir}/src/assets/__styles-dist.css`, "utf-8");

        // Parse CSS into AST (Abstract Syntax Tree)
        const ast: css.Stylesheet = css.parse(cssContent);

        // Convert AST into JavaScript object
        const cssObject: CSSObject = {};

        ast.stylesheet?.rules.forEach((rule) => {
          if (rule.type === "comment") return;

          if (rule.type === "rule") {
            const cssRule = rule as css.Rule;
            const selectors: string[] = cssRule.selectors || [];
            const declarations: StyleObject = {};

            cssRule.declarations?.forEach((declaration) => {
              if (declaration.type === "comment") return;

              const cssDeclaration = declaration as css.Declaration;

              if (!cssDeclaration.value || !cssDeclaration.property) return;

              declarations[cssDeclaration.property] = cssDeclaration.value;
            });

            selectors.forEach((selector) => {
              // strip all backslashes
              selector = selector.replace(/\\/g, "");
              cssObject[selector] = declarations;
            });
          } else if (rule.type === "media") {
            const atRule = rule as css.Media;
            const mediaQuery: MediaQuery = {};
            const mediaQueryKey = `@media ${atRule.media}`;

            atRule.rules?.forEach((subRule) => {
              if (subRule.type === "rule") {
                const cssSubRule = subRule as css.Rule;

                const selectors: string[] = cssSubRule.selectors || [];
                const declarations: StyleObject = {};

                cssSubRule.declarations?.forEach((declaration) => {
                  const cssDeclaration = declaration as css.Declaration;
                  if (!cssDeclaration.value || !cssDeclaration.property) return;

                  declarations[cssDeclaration.property] = cssDeclaration.value;
                });

                selectors.forEach((selector) => {
                  // strip all backslashes
                  selector = selector.replace(/\\/g, "");
                  mediaQuery[selector] = declarations;
                });
              }
            });

            cssObject[mediaQueryKey] = mediaQuery;
          }
        });

        // Parse CSS into AST (Abstract Syntax Tree)
        // const ast = css.parse(cssContent);

        // Convert AST into JavaScript object
        // const cssObject: Record<string, Record<string, any>> = {};

        // ast.stylesheet?.rules.forEach((rule: css.Rule) => {
        //   if (rule.type === "rule") {
        //     const selectors = rule.selectors;
        //     const declarations: Record<string, any> = {};

        //     rule.declarations?.forEach((declaration) => {
        //       if ("value" in declaration && declaration.property) {
        //         declarations[declaration.property] = declaration.value;
        //       }
        //     });

        //     selectors?.forEach((selector) => {
        //       cssObject[selector] = declarations;
        //     });
        //   }
        // });

        // Write to file
        await fs.writeFile(
          `${workingDir}/src/assets/__styles-dist.ts`,
          `export const distStyles = ${JSON.stringify(cssObject, null, 2)}`
        );

        prepLogger.info("Done build prep.");
      },

      "astro:build:done": async ({ dir, logger }) => {
        const buildLogger = logger.fork("astro-emails/build");
        buildLogger.info("Transforming HTML...");
        await emailifyHtml(dir.pathname);

        // TODO: check sizes of each file
        // if we're over 102kb (gmail clipping max), warn us!
      },
    },
  };
}

/**
 * Vite Plugin for Astro Emails HMR
 *
 * @returns
 */
function vitePluginAstroEmailsHMR(): PluginOption {
  return {
    name: "astro-emails-hmr",
    // only apply to serve command
    apply: (config, env) => env.command === "serve",
    /**
     * Config
     *
     * "disableGlobbing" idea from: https://github.com/ElMassimo/vite-plugin-full-reload/blob/main/src/index.ts
     * TODO: do we need this?
     *
     * @returns
     */
    config: () => ({ server: { watch: { disableGlobbing: false } } }),

    async configureServer({ config }) {
      config.logger.info("📧 Initializing Astro Emails 📧");

      await buildAstro({});
      await injectHMRInHtml(config.build.outDir);
    },

    /**
     * Handle Hot Update
     *
     * @param {HmrContext} param0
     */
    async handleHotUpdate({ server, file }: HmrContext) {
      if (file.includes("__")) {
        return;
      }

      // TODO: throttle?
      await buildAstro({});
      await injectHMRInHtml(server.config.build.outDir);

      // TODO: configure path?
      server.hot.send({ type: "full-reload" });
      // server.hot.send({ type: "full-reload", path: "*" });
    },
  };
}

/**
 * Normalize paths
 *
 * @param root
 * @param _path
 * @returns
 */
function normalizePaths(root: string, _path: string | string[]): string[] {
  return (Array.isArray(_path) ? _path : [_path]).map((__path) => path.resolve(root, __path)).map(normalizePath);
}

interface StyleObject {
  [property: string]: string;
}

interface MediaQuery {
  [mediaQuery: string]: StyleObject;
}

interface CSSObject {
  [selector: string]: StyleObject | MediaQuery;
}
