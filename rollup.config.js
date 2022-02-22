import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { emptyDir } from "rollup-plugin-empty-dir";
import postcss from "rollup-plugin-postcss";
import zip from "rollup-plugin-zip";
import replace from "@rollup/plugin-replace";

import {
  chromeExtension,
  simpleReloader,
} from "rollup-plugin-chrome-extension";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    chunkFileNames: path.join("chunks", "[name]-[hash].js"),
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": isProduction
        ? JSON.stringify("production")
        : JSON.stringify("development"),
      preventAssignment: true,
    }),
    chromeExtension(),
    simpleReloader(),
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extract: false,
      modules: true,
      extensions: [".scss"],
      use: ["sass"],
    }),
    emptyDir(),
    isProduction && zip({ dir: "releases" }),
  ],
};
