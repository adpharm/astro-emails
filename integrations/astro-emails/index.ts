import { build as buildAstro, type AstroIntegration } from "astro";
import path from "node:path";
import colors from "picocolors";
import serveStatic from "serve-static";
import { normalizePath, type HmrContext, type PluginOption } from "vite";
import { glob } from "glob";
import { $, within } from "zx";
import { emailifyHtml, injectHMRInHtml } from "./html-transformers";

interface PluginOptions {
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

export default function createPlugin(options?: PluginOptions): AstroIntegration {
  return {
    name: "email",
    hooks: {
      "astro:config:setup": ({ updateConfig, isRestart, logger }) => {
        if (isRestart) return;

        // logger.info("📧 Initializing Astro Emails 📧");

        // await buildAstro({ mode: "production", logLevel: "error" });

        updateConfig({
          vite: {
            plugins: [astroEmailsHMR()],
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

      "astro:build:done": async ({ dir, logger }) => {
        logger.info("Transforming CSS...");
        await within(async () => {
          $.verbose = false;
          // const workingDir = (await $`pwd`).stdout.trim();
          const workingDir = process.cwd();
          await $`postcss ${workingDir}/src/assets/_styles.css -o ${workingDir}/src/assets/_styles-dist.css`;
        });

        logger.info("Transforming HTML...");
        await emailifyHtml(dir.pathname);
      },
    },
  };
}

function astroEmailsHMR(): PluginOption {
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

      await buildAstro({ mode: "production", logLevel: "error" });
    },

    /**
     * Handle Hot Update
     *
     * @param {HmrContext} param0
     */
    async handleHotUpdate({ server }: HmrContext) {
      // TODO: throttle?
      await buildAstro({});
      await injectHMRInHtml(server.config.build.outDir);
      // TODO: configure path?
      server.hot.send({ type: "full-reload" });
      // server.hot.send({ type: "full-reload", path: "*" });
    },
  };
}

// async function build() {
//   // async function build(servingOrBuilding: "serving" | "building") {
//   // if (servingOrBuilding === "serving") {
//   //   // trigger build
//   //   console.time("Building astro");
//   //   await astroBuild({ mode: "production", logLevel: "error" });
//   //   console.timeEnd("Building astro");
//   // }

//   // for each file in input, run postcss
//   // TODO: use postcss directly?
//   console.time("PostCSS");
//   await within(async () => {
//     $.verbose = false;
//     const workingDir = (await $`pwd`).stdout.trim();
//     await $`postcss ${workingDir}/src/assets/_styles.css -o ${workingDir}/src/assets/_styles-dist.css`;
//   });
//   console.timeEnd("PostCSS");

//   // transform HTML in dist/
//   console.time("Transform HTML");
//   await transformHTML();
//   console.timeEnd("Transform HTML");

//   return;
// }

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
