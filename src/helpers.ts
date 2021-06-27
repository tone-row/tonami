import { Properties } from "csstype";
import { CSSProperties } from "react";
import {
  OldCondition,
  Selectors,
  Vars,
  CSS,
  Options,
  VarMap,
  CSSWithFunctions,
  PropertiesWithFunction,
  OldApply,
  Apply,
} from "./types";

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

/**
 * Takes a css object that may have functions for some properties
 * and adds the function to the passed in varMap, removes function
 * from the css object and replaces it with
 *
 * __not sure__
 *
 * probably just the variable string I guess
 */
export function replaceFunctionsWithCSSVariables<T>(
  css: PropertiesWithFunction<T>,
  varMap: VarMap
) {
  let r: Properties = {};
  if (!css) return r;

  for (const property in css) {
    let value = css[property];
    if (typeof value === "function") {
      const cssVar = uniqueVarName();
      varMap[cssVar] = value;
      r[property] = `var(${cssVar})`;
    } else {
      r[property] = value;
    }
  }

  return r;
}

export function cssToString<T>(
  props: CSSWithFunctions<T>,
  baseClass: string,
  varMap: VarMap,
  selector = "& {}"
): string {
  let css: string[] = [];

  let styles: string[] = [];
  if (props.vars) {
    // convert vars to string
    styles.push(objectToString(expandVars(props.vars)));
  }
  if (props.css) {
    // replace functions with variables
    const cssWithVars = replaceFunctionsWithCSSVariables(props.css, varMap);

    // convert CSS to string
    styles.push(objectToString(cssWithVars, true));
  }

  css.push(replaceSelectorWithCss(selector, baseClass, styles.join(" ")));

  // do selectors here
  if (props.selectors) {
    for (const selectorString in props.selectors) {
      css.push(
        cssToString(
          props.selectors[selectorString],
          baseClass,
          varMap,
          selectorString
        )
      );
    }
  }

  return css.join(" ");
}

/**
 * Given a string include `&` and `{}`,
 * a base class, and a css string,
 * return a comprehensive css string
 *
 * May involve recursive calls to replaceSelectors
 */
export function replaceSelectorWithCss(
  selector: string,
  baseClass: string,
  css: string
) {
  if (selector.indexOf("&") < 0)
    throw new Error(`Selector missing "&": ${selector}`);
  if (selector.indexOf("{}") < 0)
    throw new Error(`Selector missing "{}": ${selector}`);
  return selector.replace("&", baseClass).replace("{}", `{ ${css} }`);
}

/**
 * Remove arguments with a dollar sign
 * Idea borrowed from https://styled-components.com/docs/api#transient-props
 */
export function removeUnderscoreAttributes(args: Record<string, any>): any {
  let r = {};
  for (const key in args) {
    if (key[0] !== "_") {
      r[key] = args[key];
    }
  }
  return r;
}

/**
 * Convert the Apply type ({ className: * } | { attribute: [*, ?*]}) into
 * the correct css selector string ".*" | "[*]"
 */
export function oldApplyToString(apply: OldApply): string {
  if ("className" in apply) {
    return `.${apply.className}`;
  }
  if (apply.attribute.length === 1) {
    return `[${apply.attribute[0]}]`;
  }
  return `[${apply.attribute[0]}="${apply.attribute[1]}"]`;
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
