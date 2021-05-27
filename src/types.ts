import { Properties } from "csstype";
import { CSSProperties } from "react";

// export type Vars = {
//   [K in string | number | symbol]: string | number | string[] | number[] | Vars;
// };
export type Vars = Record<string, any>;
export type Styles = { vars?: Vars; css?: Properties };
export type Selectors = { [Selector in string]: Styles };
export type ReturnComponentProps = { style: CSSProperties; className: string };

export type Apply<T> = boolean | ((args: T) => any);
export type Options<T extends any = undefined> = Styles & {
  // Return true-y to append class to component
  apply?: Apply<T>;
};

export type GetClasses<T> = (vars?: T) => string;
