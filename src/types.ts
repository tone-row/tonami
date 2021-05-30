import { Properties } from "csstype";
import { CSSProperties } from "react";

export type PropertiesWithFunction<T> = {
  [K in keyof Properties]: Properties[K] | ((args: T) => void);
};
export type Vars = Record<string, any>;
export type Styles = { vars?: Vars; css?: Properties };
export type Selectors = { [selector: string]: Styles };
export type ReturnComponentProps = { style: CSSProperties; className: string };

export type Condition<T> = boolean | ((args: T) => any);
export type Options<T extends any = undefined> = {
  vars?: Vars;
  css?: PropertiesWithFunction<T>;
  condition?: Condition<T>;
};

export type UseClassGroup<T> = (vars?: T) => {
  className: string;
  style?: CSSProperties;
};

export type VarMap = Record<string, () => string>;
