import { build } from "astro";
import { transformHTML } from "../posthtml-transformers/index.ts";
import { $, echo, within } from "zx";
import type { HmrContext, PluginOption, ViteDevServer } from "vite";
import path from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "../dist");
// import postcss from "postcss";

export function emailhtml(): PluginOption {
  return {
    name: "email-html",

    // options(options: any) {
    //   options.plugins = options.plugins?.filter((p: any) => p.name !== "vite:build-html");
    // },

    // configResolved(resolvedConfig: any) {
    //   // store the resolved config
    //   config = resolvedConfig;
    // },

    // async renderStart(options, inputOptions) {
    //   console.log(options);
    //   // console.log(inputOptions);
    //   return;
    // },

    // async writeBundle(options, bundle) {
    //   // console.log(options);
    //   console.log(bundle);

    //   return;
    // },

    // enforce: "post",
    // apply: "build",

    // async transform(src: string, id: string) {
    //   // throw new Error("Not implemented");
    //   // if (!id.endsWith(".html")) return;
    //   // console.log("Transforming HTML for email...");
    //   // if (id === "/Users/benhonda/Documents/adpharm/astro-emails/src/pages/index.astro") {
    //   //   console.log("Transforming Div.astro");
    //   //   console.log(src);
    //   // }
    //   console.log(id);
    //   return;
    // },

    // async transformIndexHtml(html: any) {
    //   console.log(html);

    //   return html;
    // },

    // configurePreviewServer(server) {
    //   // return a post hook that is called after other middlewares are
    //   // installed
    //   return () => {
    //     server.middlewares.use((req, res, next) => {
    //       // custom handle request...
    //       console.log("running..");
    //     });
    //   };
    // },

    // enforce: "pre",
    apply: "serve",

    // config: () => ({ server: { watch: { usePolling: true } } }),

    configureServer({ middlewares, watcher }: ViteDevServer) {
      /**
       * Redirect requests to .html
       */
      middlewares.use(async (req, res, next) => {
        if (!req.url?.endsWith(".html")) {
          if (req.url === "/") {
            req.url = "/index.html";
          }
          // TODO: only match our paths!
          // TODO: build - just build! see https://vitejs.dev/guide/api-plugin.html#conditional-application 
          // else {
          //   // redirect to .html
          //   req.url += ".html";
          // }
        }

        next();
      });

      /**
       * Serve the dist directory
       */
      middlewares.use(serveStatic(distDir));
    },

    // async watchChange(id: string, change: { event: "create" | "update" | "delete" }) {
    //   // console.log("File changed: ", id);
    //   // trigger build
    //   console.time("Building astro");
    //   await build({ mode: "production", logLevel: "error" });
    //   console.timeEnd("Building astro");

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
    // },

    async handleHotUpdate({ server, modules, timestamp, file }: HmrContext) {
      // console.log("File changed: ", file);
      // trigger build
      console.time("Building astro");
      await build({ mode: "production", logLevel: "error" });
      console.timeEnd("Building astro");

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

      // server.hot.send({ type: "full-reload" });
      server.hot.send({ type: "full-reload", path: "*" });
      // server.restart()

      // return [];
    },

    // load(id, options) {
    //   console.log("Loading...");
    //   console.log(id);
    //   return;
    // },

    // async transform(code, id, options) {
    //   // inject code to refresh the page when "full-reload" message is received
    //   console.log(id);
    //   if (id.endsWith(".html")) {
    //     console.log(id);
    //     console.log(code);
    //     // return code.replace(
    //     //   "</body>",
    //     //   `<script>
    //     //     const socket = new WebSocket("ws://localhost:3000");
    //     //     socket.onmessage = (event) => {
    //     //       if (event.data === "full-reload") {
    //     //         window.location.reload();
    //     //       }
    //     //     };
    //     //   </script>
    //     //   </body>`
    //     // );
    //   }
    // },

    // async moduleParsed({ id }) {
    //   console.log("Module parsed");
    //   console.log(id);

    //   return
    // },
  };
}
