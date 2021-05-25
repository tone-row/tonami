import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

import packageJson from "./package.json";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "default",
      },
    ],
    plugins: [peerDepsExternal(), json(), resolve(), commonjs(), typescript()],
  },
];
