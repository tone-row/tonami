import { Properties } from "csstype";
import { CSSProperties } from "react";
import { Apply, Vars } from "./types";

function isVars(o: unknown): o is Vars {
  return typeof o === "object";
}

/**
 * Takes a nested object and returns an object with all of the keys
 * converted to css property names using a "-" to adjoin childnames
 * to their parent
 *
 * Input:
 * { colors: { red: 'red', blue: 'blue' } }
 *
 * Output:
 * { "--colors-red": 'red', "--colors-blue": 'blue' }
 */
export function transformVars(vars: Vars, start = "-") {
  let o = {} as CSSProperties;
  for (const key in vars) {
    let value = vars[key];
    let fullKey = [start, key].filter(Boolean).join("-");
    if (isVars(value)) {
      o = { ...o, ...transformVars(value, fullKey) };
    } else {
      o[fullKey] = value;
    }
  }

  return o;
}

/**
 * Converts css object into a string
 * @param obj CSS object
 * @param isCss Whether to convert camelCase to kebab-case
 * @returns A string
 */
export function objectToString(
  obj: CSSProperties | Properties,
  isCss: boolean = false
) {
  let str = "";
  if (isCss) {
    for (const key in obj) {
      str += `${camelToKebab(key)}: ${obj[key]};`;
    }
  } else {
    for (const key in obj) {
      str += `${key}: ${obj[key]};`;
    }
  }
  return str;
}

// https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
const camelToKebab = (string: String) => {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

/**
 * Returns a function which can be called with args
 * dynamically to determine which classes should be added to the component
 */
export function prepareClassNames<T>(classNamesObject: Record<string, Apply>) {
  return (args: T) => {
    let classes = [];
    for (const key in classNamesObject) {
      let value = classNamesObject[key];
      // If function and result true
      if (typeof value === "function" && Boolean(value(args))) {
        console.log(value(args));
        classes.push(key);
      } else if (typeof value !== "function" && value) {
        // Or if true
        classes.push(key);
      }
    }
    return classes.join(" ");
  };
}
