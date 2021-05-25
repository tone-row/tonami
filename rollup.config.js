import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [peerDepsExternal(), resolve(), commonjs(), typescript()],
  },
  // {
  //   input: "./src/generate.ts",
  //   output: [
  //     {
  //       banner: "#!/usr/bin/env node",
  //       file: packageJson.bin.slang,
  //       format: "cjs",
  //       sourcemap: true,
  //     },
  //   ],
  //   plugins: [resolve(), typescript()],
  // },
];
