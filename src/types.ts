import { Properties } from "csstype";
import { CSSProperties } from "react";

export type Vars = {
  [K in string]: string | number | string[] | number[] | Vars;
};
export type StyleTuple = { 0?: Vars; 1?: Properties };
export type Selectors = { [Selector in string]: StyleTuple };
export type ReturnComponentProps = { style: CSSProperties; className: string };

export type Apply = boolean | ((args: any) => any);
export type Options = {
  // Permanent css properties
  css: Properties;
  // Return true-y to append class to component
  apply?: Apply;
};
