import { Properties } from "csstype";
import { CSSProperties } from "react";
import { Selectors, Apply } from "./lib/types";

/**
 * Converts css object into a string
 * Leaves keys begining with "--" untouched
 * Convert other keys from camel to kebab (fontFamily becomes font-family)
 */
export function objectToString(obj: CSSProperties) {
  let str: string[] = [];
  for (const key in obj) {
    if (key.slice(0, 2) === "--") {
      str.push(key + ": " + obj[key] + ";");
    } else {
      str.push(camelToKebab(key) + ": " + obj[key] + ";");
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
    html.push(cssToString(selector, args[selector]));
  }
  return html.join(" ");
}

let uniqueCssVariableName = 0;
export function uniqueVarName() {
  return "--ta" + uniqueCssVariableName++;
}

/**
 * Converts {@link Apply} to a selector suffix
 */
export function applyToSelector(apply: Apply): string {
  let selector = [];
  for (const key in apply) {
    if (key === "className") {
      selector.push("." + apply.className.split(" ").join("."));
    } else {
      if (apply[key] === true) {
        selector.push("[" + key + "]");
      } else {
        selector.push("[" + key + "=" + apply[key] + "]");
      }
    }
  }
  return selector.join("");
}

export function cssToString(
  selector: string,
  cssObject: Properties,
  fill = "& {}"
) {
  return fill
    .replace(/\&/gi, selector)
    .replace(/\{\}/gi, "{ " + objectToString(cssObject) + " }");
}
