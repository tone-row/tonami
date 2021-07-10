import { Properties } from "csstype";
import { options } from "./lib/constants";
import { getUniqueClassName } from "./lib/getUniqueClassName";
import { getUniqueId } from "./lib/getUniqueId";
import { applyToSelector, cssToString, uniqueVarName } from "./helpers";
import { ConditionsMap, Ruleset, VarMap } from "./lib/types";
import { mainSheet } from "./sheet";

export function rulesets<Interface>(...rulesets: Ruleset<Interface>[]) {
  const elementId = getUniqueId();
  const baseClass = getUniqueClassName();

  // Prepare permanent html + classNamesObject
  let css: string[] = []; // Static CSS
  let conditions: ConditionsMap<Interface> = new Map();
  conditions.set({ className: baseClass }, true);
  let varsMap: VarMap = {}; // stores css variabls for runtime processing

  /* This loop adds roughly 10ms to the render time of each part */
  for (const ruleset of rulesets) {
    // first you need to pull off anything that isn't css
    const {
      apply = { className: getUniqueClassName() },
      condition = true,
      selectors = {},
      ...style
    } = ruleset;

    // future logic for applying this (class or att)
    conditions.set(apply, condition);

    // turn your apply method into a selector
    const rootSelector = "." + baseClass + applyToSelector(apply);

    // copy style
    let subSelectorCss: string[] = [];

    for (const selector in selectors) {
      subSelectorCss.push(
        cssToString(
          rootSelector,
          replaceFuncsWithVars(selectors[selector], varsMap),
          selector
        )
      );
    }

    // replace css functions with variables
    const sanitizedCss = replaceFuncsWithVars(style, varsMap);

    // add css
    css.push(cssToString(rootSelector, sanitizedCss));
    css = css.concat(subSelectorCss);
  }

  // Set styles
  mainSheet.setStyle(elementId, css.join(" "));

  return function (props: Interface) {
    const user = filterUserAttributes(props);
    const tonami = getTonamiAttributes(conditions, varsMap, props);
    const style = user.style
      ? { ...tonami.style, ...user.style }
      : tonami.style;
    const className = user.className
      ? tonami.className + " " + user.className
      : tonami.className;

    return {
      ...tonami,
      ...user,
      style,
      className,
    };
  };
}

/**
 * Filter props with a starting letter
 * https://styled-components.com/docs/api#transient-props
 */
function filterUserAttributes<Interface>(props?: Interface): {
  style?: {};
  className?: string;
} {
  let validProps: Record<string, unknown> = {};
  for (const key in props) {
    if (options.shouldForwardProp(key, props[key]))
      validProps[key] = props[key];
  }
  return validProps;
}

function getTonamiAttributes<Interface>(
  conditions: ConditionsMap<Interface>,
  varsMap: VarMap,
  args: Interface
) {
  let attributes: any = { style: {}, className: [] };
  for (let [apply, condition] of conditions) {
    const shouldApply =
      typeof condition === "function" ? condition(args) : condition;
    if (shouldApply) {
      if ("className" in apply) {
        attributes.className.push(apply.className);
      } else {
        attributes = { ...attributes, ...apply };
      }
    }
  }
  attributes.className = attributes.className.join(" ");
  // Set css custom properties
  for (const key in varsMap) {
    attributes.style[key] = varsMap[key](args);
  }
  return attributes;
}

export function replaceFuncsWithVars<T>(css: Ruleset<T>, varsMap: VarMap) {
  let r: Properties = {};
  if (!css) return r;

  for (const property in css) {
    let value = css[property];
    if (typeof value === "function") {
      const cssVar = uniqueVarName();
      varsMap[cssVar] = value;
      r[property] = "var(" + cssVar + ")";
    } else {
      r[property] = value;
    }
  }

  return r;
}
