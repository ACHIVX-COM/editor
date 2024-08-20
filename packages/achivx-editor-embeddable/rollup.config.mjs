import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import nodePolyfill from "rollup-plugin-polyfill-node";
import css from "rollup-plugin-import-css";
import svgr from "@svgr/rollup";

const minimize = true;

const plugins = [
  ...(minimize ? [terser()] : []),
  resolve({
    browser: true,
  }),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  }),
  babel({
    exclude: /node_modules/,
    presets: ["@babel/preset-react", "@babel/preset-env"],
    babelHelpers: "bundled",
  }),
  commonjs(),
  json(),
  nodePolyfill(),
  css(),
  svgr(),
];

export default [
  {
    input: "./index.js",
    output: {
      file: "./build/achivx-editor-embeddable.js",
      format: "iife",
    },
    plugins,
  },
  {
    input: "./viewerOnly.js",
    output: {
      file: "./build/achivx-viewer-embeddable.js",
      format: "iife",
    },
    plugins,
  },
];
