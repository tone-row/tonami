import { Properties } from "csstype";
import { CSSProperties } from "react";
import { Selectors, Vars, Apply } from "./types";

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
export function expandVars<T extends Vars>(vars: T, start = "-") {
  let o = {} as CSSProperties;
  for (const key in vars) {
    let value = vars[key];
    let fullKey = [start, key].filter(Boolean).join("-");
    if (isVars(value)) {
      o = { ...o, ...expandVars(value, fullKey) };
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
  let str: string[] = [];
  if (isCss) {
    for (const key in obj) {
      str.push(`${camelToKebab(key)}: ${obj[key]};`);
    }
  } else {
    for (const key in obj) {
      str.push(`${key}: ${obj[key]};`);
    }
  }
  return str.join(" ");
}

// https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
const camelToKebab = (string: String) => {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

/**
 * Converts selectors to a string of styles
 */
export function selectorsToString(args: Selectors) {
  let html: string[] = [];
  for (const selector in args) {
    const { vars = {}, css = {} } = args[selector];
    const varsString = objectToString(expandVars(vars));
    const cssString = objectToString(css, true);
    if (varsString || cssString) {
      html.push(`${selector} {`);
      if (varsString) html.push(varsString);
      if (cssString) html.push(cssString);
      html.push(`}`);
    }
  }
  return html.join(" ");
}

let uniqueCssVariableName = 0;
export function uniqueVarName() {
  return `--ta${uniqueCssVariableName++}`;
}

export function applyToString(apply: Apply): string {
  let selector = [];
  for (const key in apply) {
    if (key === "className") {
      selector.push(`.${apply.className.split(" ").join(".")}`);
    } else {
      if (apply[key] === true) {
        selector.push(`[${key}]`);
      } else {
        selector.push(`[${key}=${apply[key]}]`);
      }
    }
  }
  return selector.join("");
}
