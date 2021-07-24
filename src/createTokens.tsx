// type V = { [key: string]: string | V };

import { createGlobalStyle } from "./createGlobalStyle";
import { cssToString } from "./helpers";
import { useRules } from "./useRules";

type Tokens<T> = T & {
  toStyleObject: () => Record<string, string>;
  Tokens: () => null;
  createDynamicTokens: <X>(fn: (props: X) => T) => (props: X) => null;
};

export function createTokens<V extends object>(vars: V) {
  let map = {};
  let R = {} as Tokens<V>;
  function setVars(obj: object, returnObj: object, keys: string[] = []) {
    for (const key in obj) {
      let curVal = obj[key],
        curKeys = keys.concat(key);
      if (["string", "number"].includes(typeof curVal)) {
        let varName = `--${curKeys.join("-")}`;
        map[varName] = curVal;
        returnObj[key] = `var(${varName})`;
      } else if (typeof curVal === "object") {
        returnObj[key] = {};
        setVars(curVal, returnObj[key], curKeys);
      }
    }
  }
  Object.setPrototypeOf(R, {
    toStyleObject() {
      return map;
    },
    Tokens: createGlobalStyle({ html: map }),
    createDynamicTokens<T>(fn: (props: T) => V) {
      function DynamicTokens(props: T) {
        let rules: string[] = [
          cssToString("html", createTokens(fn(props)).toStyleObject()),
        ];
        useRules(rules);
        return null;
      }
      return DynamicTokens;
    },
  });
  setVars(vars, R);
  return R;
}
