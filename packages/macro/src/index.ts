import fs from "fs";
import { join } from "path";
import { createMacro, MacroHandler } from "babel-plugin-macros";

const cssVarsMacro: MacroHandler = ({ babel: { types: t }, references }) => {
  console.log(join(process.cwd(), "test.css"));
  // fs.writeFileSync(
  //   join(__dirname, "test.css"),
  //   `body {background-color: orange;}`
};
export default createMacro(cssVarsMacro);
