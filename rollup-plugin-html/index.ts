import { build as astroBuild } from "astro";
import { transformHTML } from "../posthtml-transformers/index.ts";
import { $, within } from "zx";
import { type HmrContext, type PluginOption, type ViteDevServer, normalizePath } from "vite";
import path from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";
import colors from "picocolors";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "../dist");

interface MyPluginProps {
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

export function emailhtml(props?: MyPluginProps): PluginOption {
  let servingOrBuilding: "serving" | "building" = "serving";

  return {
    name: "email-html",
    enforce: "post",

    /**
     * Apply
     *
     * @param config
     * @param env
     * @returns
     */
    apply(config, env) {
      // NOTE: we have to do it this way because env.command is "serve" at some point when JUST building...
      if (env.command === "build") {
        servingOrBuilding = "building";
      }

      // apply this plugin on both serve and build
      return true;
    },

    /**
     * Config
     *
     * "disableGlobbing" idea from: https://github.com/ElMassimo/vite-plugin-full-reload/blob/main/src/index.ts
     * TODO: do we need this?
     *
     * @returns
     */
    config: () => ({ server: { watch: { disableGlobbing: false } } }),

    /**
     * Configure Server
     *
     * @param {ViteDevServer} param0
     */
    async configureServer({ middlewares, config }: ViteDevServer) {
      // console.log("configureServer");
      // console.log("config.mode", config.mode);
      // servingOrBuilding = "serving";

      const { input = `${config.build.outDir}/**/*.html`, root = config.root } = props || {};
      const paths = normalizePaths(root, input);

      /**
       * Redirect requests to .html
       */
      middlewares.use(async (req, res, next) => {
        // if no url, skip
        if (!req.url) return next();
        // if url ends with .html already, skip
        if (req.url?.endsWith(".html")) return next();

        // get file paths relative to config.build.outDir and remove .html extension
        const files = (await glob(paths)).map((_path) =>
          path.relative(config.build.outDir, _path).replace(/\.html$/, "")
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
          config.logger.info(
            `${colors.green("[email matching]")} ${colors.dim(`${req.url} -> ${req.url}${".html"}`)}`,
            {
              clear: true,
              timestamp: true,
            }
          );

          req.url += ".html";
        }

        return next();
      });

      /**
       * Serve the dist directory
       */
      middlewares.use(serveStatic(distDir));
    },

    /**
     * Handle Hot Update
     *
     * @param {HmrContext} param0
     */
    async handleHotUpdate({ server }: HmrContext) {
      await build(servingOrBuilding);
      // TODO: configure path?
      server.hot.send({ type: "full-reload" });
      // server.hot.send({ type: "full-reload", path: "*" });
    },

    /**
     * Build End
     *
     * @param error
     */
    async writeBundle() {
      // finish the build process, if no error
      // if (error) throw error;

      // sleep for a bit
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      // build fn
      // await build(servingOrBuilding);

      console.log(colors.green("Email HTML build complete!"));
    },
  };
}

async function build(servingOrBuilding: "serving" | "building") {
  if (servingOrBuilding === "serving") {
    // trigger build
    console.time("Building astro");
    await astroBuild({ mode: "production", logLevel: "error" });
    console.timeEnd("Building astro");
  }

  // for each file in input, run postcss
  // TODO: use postcss directly?
  console.time("PostCSS");
  await within(async () => {
    $.verbose = false;
    const workingDir = (await $`pwd`).stdout.trim();
    await $`postcss ${workingDir}/src/assets/_styles.css -o ${workingDir}/src/assets/_styles-dist.css`;
  });
  console.timeEnd("PostCSS");

  // transform HTML in dist/
  console.time("Transform HTML");
  await transformHTML();
  console.timeEnd("Transform HTML");

  return;
}

function normalizePaths(root: string, _path: string | string[]): string[] {
  return (Array.isArray(_path) ? _path : [_path]).map((__path) => path.resolve(root, __path)).map(normalizePath);
}
