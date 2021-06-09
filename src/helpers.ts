import { Properties } from "csstype";
import { CSSProperties } from "react";
import {
  Condition,
  Selectors,
  Vars,
  CSS,
  Options,
  VarMap,
  CSSWithFunctions,
  PropertiesWithFunction,
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
export function prepareClassNames<T>(
  classNamesObject: Record<string, Condition<T>>
) {
  return (args: T) => {
    let classes = [];
    for (const key in classNamesObject) {
      let value = classNamesObject[key];
      // If function and result true
      if (typeof value === "function" && Boolean(value(args))) {
        classes.push(key);
      } else if (typeof value !== "function" && value) {
        // Or if true
        classes.push(key);
      }
    }
    return classes.join(" ");
  };
}

/**
 * Returns a function which can be called with args to
 * dynamically assign values to css variables
 */
export function prepareCssVars<T>(varMap: Record<string, (args: T) => string>) {
  return (args: T) => {
    let style = {};
    for (const key in varMap) {
      style[key] = varMap[key](args);
    }
    return style as CSSProperties;
  };
}

/**
 * Converts selectors to a string of styles
 */
export function selectorsToString(args: Selectors) {
  let html = ``;
  for (const selector in args) {
    const { vars = {}, css = {} } = args[selector];
    const obj = expandVars(vars);
    html += `${selector} { ${objectToString(obj)} ${objectToString(
      css,
      true
    )} }`;
  }
  return html.trim();
}

let uniqueCssVariableName = 0;
function getUniqueCssVariableName() {
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
export function replaceVarFunctionsWithVars<T>(
  css: PropertiesWithFunction<T>,
  varMap: VarMap
) {
  let r: Properties = {};
  if (!css) return r;

  for (const property in css) {
    let value = css[property];
    if (typeof value === "function") {
      const cssVar = getUniqueCssVariableName();
      varMap[cssVar] = value;
      r[property] = `var(${cssVar})`;
    } else {
      r[property] = value;
    }
  }

  return r;
}

export function buildCssString<T>(
  props: CSSWithFunctions<T>,
  baseClass: string,
  varMap: VarMap,
  selector = "& {}"
): string {
  let css = "";

  let styles = "";
  if (props.vars) {
    // convert vars to string
    styles += objectToString(expandVars(props.vars));
  }
  if (props.css) {
    // replace functions with variables
    const css = replaceVarFunctionsWithVars(props.css, varMap);

    // convert CSS to string
    styles += objectToString(css, true);
  }

  css += replaceSelectorWithCss(selector, baseClass, styles);

  // do selectors here
  if (props.selectors) {
    for (const selectorString in props.selectors) {
      css += buildCssString(
        props.selectors[selectorString],
        baseClass,
        varMap,
        selectorString
      );
    }
  }

  return css;
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
