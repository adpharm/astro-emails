#!/usr/bin/env zx

import { $, within, chalk } from "zx";
import { transformHTML } from "./posthtml-transformers/index.ts";
import { watch } from "chokidar";
import _ from "lodash";

const watcher = watch("./src/**/*.{css,html,astro}");

void (async function () {
  watcher.on(
    "all",
    _.throttle(
      async () => {
        console.log(chalk.yellow("[PostCSS] Watching for changes..."));
        await $`astro build`;
        await $`postcss ./src/assets/_styles.css -o ./src/assets/_styles-dist.css`;
        await transformHTML();
        console.log(chalk.green("[PostCSS] Done!"));
      },
      2000,
      {
        trailing: true,
      }
    )
  );

  // within(async () => {
  //   console.log(chalk.yellow("[PostCSS] Watching for changes..."));
  //   await $`postcss ./src/assets/_styles.css -o ./src/assets/_styles-dist.css`;
  //   await transformHTML();
  //   console.log(chalk.green("[PostCSS] Done!"));
  // });

  // within(async () => {
  //   console.log(chalk.yellow("[Misc.] transformHTML..."));
  //   await transformHTML();
  // });

  within(async () => {
    console.log(chalk.yellow("[Astro] Starting dev server..."));
    await $`astro preview --watch`;
  });
})();
