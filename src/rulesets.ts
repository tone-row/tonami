import { Properties } from "csstype";
import { options } from "./lib/constants";
import { getUniqueClassName } from "./lib/getUniqueClassName";
import { applyToSelector, cssToString } from "./helpers";

import { ConditionsMap, Ruleset } from "./lib/types";
import { sheet } from "./sheet";

type VMAP<T> = Map<string, (props: T) => string>;

export function rulesets<Interface>(...rulesets: Ruleset<Interface>[]) {
  const baseClass = getUniqueClassName(JSON.stringify(rulesets));

  // Prepare permanent html + classNamesObject
  let rules: string[] = []; // Static CSS
  let conditions: ConditionsMap<Interface> = new Map();
  let vMap2: VMAP<Interface> = new Map(); // stores css variabls for runtime processing

  /* This loop adds roughly 10ms to the render time of each part */
  for (let i = 0; i < rulesets.length; i++) {
    // first you need to pull off anything that isn't css
    let { apply, condition, selectors, ...style } = rulesets[i];

    // replace css functions with variables
    const sanitizedCss = replaceFuncsWithVars(style, vMap2, baseClass);

    condition = condition ?? true;
    apply = apply ?? {
      className: getUniqueClassName(JSON.stringify(sanitizedCss)),
    };

    // future logic for applying this (class or att)
    conditions.set(apply, condition);

    // turn your apply method into a selector
    const rootSelector = "." + baseClass + applyToSelector(apply);

    // add css
    rules.push(cssToString(rootSelector, sanitizedCss));

    if (selectors) {
      for (const selector in selectors) {
        rules.push(
          cssToString(
            rootSelector,
            replaceFuncsWithVars(selectors[selector], vMap2, baseClass),
            selector
          )
        );
      }
    }
  }

  function getComponentProps(props: Interface) {
    const user = filterUserAttributes(props);
    const tonami = getTonamiAttributes(conditions, vMap2, baseClass, props);
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
  }

  // Insert Rules
  const ruleIndexes = sheet.insertRules(rules, true);

  getComponentProps.ruleIndexes = ruleIndexes;

  return getComponentProps;
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
  varsMap: VMAP<Interface>,
  baseClass: string,
  args: Interface
) {
  let attributes: any = { style: {}, className: [baseClass] };
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
  for (let [cssvar, fn] of varsMap) {
    attributes.style[cssvar] = fn(args);
  }
  return attributes;
}

export function replaceFuncsWithVars<T>(
  css: Ruleset<T>,
  varsMap: VMAP<T>,
  baseClass: string
) {
  let r: Properties = {};
  if (!css) return r;

  for (const property in css) {
    let value = css[property];
    if (typeof value === "function") {
      const cssVar = "--" + baseClass + "-" + varsMap.size;
      varsMap.set(cssVar, value);
      r[property] = "var(" + cssVar + ")";
    } else {
      r[property] = value;
    }
  }

  return r;
}
