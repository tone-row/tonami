import { Properties } from "csstype";
import { CSSProperties } from "react";

export type PropertiesWithFunction<T> = {
  [K in keyof Properties]: Properties[K] | ((args: T) => void);
};
export type Vars = Record<string, any>;
export type Styles = { vars?: Vars; css?: Properties };
export type Selectors = { [selector: string]: Styles };
export type ReturnComponentProps = { style: CSSProperties; className: string };

export type OldApply =
  | { className: string }
  | { attribute: [string] | [string, string] };

export type Apply = Record<string, any>;

export type OldCondition<T> = boolean | ((args: T) => any);
export type Options<T extends any = undefined> = {
  // vars?: Vars;
  // css?: PropertiesWithFunction<T>;
  condition?: OldCondition<T>;
  apply?: OldApply;
  styles: CSSWithFunctions<T>;
};

export type Subselectors<T> = { [k: string]: PropertiesWithFunction<T> };

export type Ruleset<T> = PropertiesWithFunction<T> & {
  apply?: Apply;
  condition?: Condition<T>;
  // any because it has to overlap with all potential property values
} & { [k: string]: any };

export type UseClassGroup<T> = (vars?: T) => {
  className: string;
  style?: CSSProperties;
};

export type VarMap = Record<string, (args: any) => string>;

export type CSS =
  | { css: CSSProperties }
  | { css?: CSSProperties; selectors: { [selector: string]: CSS } };

export type CSSWithFunctions<T> =
  | {
      css: PropertiesWithFunction<T>;
      vars?: Vars;
      selectors?: { [selector: string]: CSSWithFunctions<T> };
    }
  | {
      css?: PropertiesWithFunction<T>;
      vars: Vars;
      selectors?: { [selector: string]: CSSWithFunctions<T> };
    }
  | {
      css?: PropertiesWithFunction<T>;
      vars?: Vars;
      selectors: { [selector: string]: CSSWithFunctions<T> };
    };

export type Condition<Interface> = boolean | ((props: Interface) => boolean);
export type ConditionsMap<Interface> = Map<
  Record<string, string>,
  Condition<Interface>
>;
