import { $ } from "zx";

export function emailhtml() {
  let config;

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
    //   if (id === "/Users/benhonda/Documents/adpharm/astro-emails/src/pages/index.astro") {
    //     console.log("Transforming Div.astro");
    //     console.log(src);
    //   }
    //   return;
    // },

    // async transformIndexHtml(html: any) {
    //   console.log(html);

    //   return html;
    // },

    async handleHotUpdate({ server, modules, timestamp }) {
      // Also use `server.ws.send` to support Vite <5.1 if needed
      // server.hot.send({ type: "full-reload" });
      // Invalidate modules manually
      // const invalidatedModules = new Set();
      // for (const mod of modules) {
      //   server.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true);
      // }
      // server.hot.send({ type: 'full-reload' })
      console.log("Hot update");
      // console.log(server);
      // console.log(modules);

      // trigger build
      await $`astro build`;

      return [];
    },

    // async moduleParsed({ id }) {
    //   console.log("Module parsed");
    //   console.log(id);

    //   return
    // },
  };
}
