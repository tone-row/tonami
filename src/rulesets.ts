import { Properties } from "csstype";
import { options } from "./constants";
import { getUniqueClassName } from "./getUniqueClassName";
import { getUniqueId } from "./getUniqueId";
import { applyToString, objectToString, uniqueVarName } from "./helpers";
import { useStyle } from "./style";
import { ConditionsMap, Ruleset, VarMap } from "./types";

export function rulesets<Interface>(...rulesets: Ruleset<Interface>[]) {
  const elementId = getUniqueId();
  const baseClass = getUniqueClassName();

  // Prepare permanent html + classNamesObject
  let css: string[] = []; // Static CSS
  let conditions: ConditionsMap<Interface> = new Map();
  conditions.set({ className: baseClass }, true);
  let varsMap: VarMap = {}; // stores css variabls for runtime processing

  for (const ruleset of rulesets) {
    // first you need to pull off anything that isn't css
    const {
      apply = { className: getUniqueClassName() },
      condition = true,
      ...style
    } = ruleset;

    // future logic for applying this (class or att)
    conditions.set(apply, condition);

    // turn your apply method into a selector
    const selector = `.${baseClass}${applyToString(apply)}`;

    // copy style
    let sanitizeStyle = { ...style },
      subSelectorCss: string[] = [];

    // check for sub selectors
    const subSelectors = Object.keys(style).filter(
      (key) => key.includes("&") && key.includes("{}")
    );

    if (subSelectors.length) {
      for (const subSelector of subSelectors) {
        // remove style from subselectors
        delete sanitizeStyle[subSelector];

        subSelectorCss.push(
          cssToString(
            selector,
            replaceFuncsWithVars(style[subSelector], varsMap),
            subSelector
          )
        );
      }
    }
    // replace css functions with variables
    const sanitizedCss = replaceFuncsWithVars(sanitizeStyle, varsMap);

    // add css
    css.push(cssToString(selector, sanitizedCss));
    css = css.concat(subSelectorCss);
  }

  return function (props?: Interface) {
    // Write CSS
    useStyle(elementId, css.join(" "));

    // build and return element props
    // const className = getClassNames<Interface>(conditionalClasses, props);
    const attributes = getAtts(conditions, varsMap, props);
    const validProps = filterStartingLetter(props as any);
    return { ...attributes, ...validProps };
  };
}

/**
 * Filter props with a starting letter
 * https://styled-components.com/docs/api#transient-props
 */
function filterStartingLetter(props?: Record<string, unknown>) {
  let validProps = {};
  for (const key in props) {
    if (key[0] === options.startingLetter) continue;
    validProps[key] = props[key];
  }
  return validProps;
}

function getAtts<Interface>(
  conditions: ConditionsMap<Interface>,
  varsMap: VarMap,
  args: Interface
) {
  const classNames = [];
  let attributes: any = { style: {} };
  for (let [apply, condition] of conditions) {
    const shouldApply =
      typeof condition === "function" ? condition(args) : condition;
    if (shouldApply) {
      if ("className" in apply) {
        classNames.push(apply.className);
      } else {
        attributes = { ...attributes, ...apply };
      }
    }
  }
  attributes["className"] = classNames.join(" ");
  for (const key in varsMap) {
    attributes.style[key] = varsMap[key](args);
  }
  return attributes;
}

function cssToString(selector: string, cssObject: Properties, fill = "& {}") {
  return fill
    .replace(/\&/gi, selector)
    .replace(/\{\}/gi, `{ ${objectToString(cssObject, true)} }`);
}

function replaceFuncsWithVars<T>(css: Ruleset<T>, varsMap: VarMap) {
  let r: Properties = {};
  if (!css) return r;

  for (const property in css) {
    let value = css[property];
    if (typeof value === "function") {
      const cssVar = uniqueVarName();
      varsMap[cssVar] = value;
      r[property] = `var(${cssVar})`;
    } else {
      r[property] = value;
    }
  }

  return r;
}
