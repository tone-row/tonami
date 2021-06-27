import { Properties } from "csstype";

type PropertiesWithFunction<T> = {
  [K in keyof Properties]: Properties[K] | ((args: T) => void);
};

type Vars = Record<string, any>;

export type Selectors = { [selector: string]: Properties & Vars };

/**
 * The apply type represents what attributes should be applied to a component
 */
export type Apply = Record<string, any>;

export type Ruleset<T> = PropertiesWithFunction<T> & {
  apply?: Apply;
  condition?: Condition<T>;
  // any because it has to overlap with all potential property values
  // todo: Needs to be typed to PropertiesWithFunctions somehow
} & { [k: string]: any };

export type VarMap = Record<string, (args: any) => string>;

type Condition<Interface> = boolean | ((props: Interface) => boolean);
export type ConditionsMap<Interface> = Map<
  Record<string, string>,
  Condition<Interface>
>;
