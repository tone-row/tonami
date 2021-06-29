import { Properties } from "csstype";
import { options } from "./lib/constants";
import { getUniqueClassName } from "./lib/getUniqueClassName";
import { getUniqueId } from "./lib/getUniqueId";
import { applyToSelector, cssToString, uniqueVarName } from "./helpers";
import { useStyle } from "./style";
import { ConditionsMap, Ruleset, VarMap } from "./lib/types";

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
      selectors = {},
      ...style
    } = ruleset;

    // future logic for applying this (class or att)
    conditions.set(apply, condition);

    // turn your apply method into a selector
    const rootSelector = `.${baseClass}${applyToSelector(apply)}`;

    // copy style
    let subSelectorCss: string[] = [];

    if (Object.keys(selectors).length) {
      for (const selector in selectors) {
        subSelectorCss.push(
          cssToString(
            rootSelector,
            replaceFuncsWithVars(selectors[selector], varsMap),
            selector
          )
        );
      }
    }
    // replace css functions with variables
    const sanitizedCss = replaceFuncsWithVars(style, varsMap);

    // add css
    css.push(cssToString(rootSelector, sanitizedCss));
    css = css.concat(subSelectorCss);
  }

  return function (props?: Interface) {
    useStyle(elementId, css.join(" "));
    const validProps = forwardProps(props as any);
    const attributes = getAtts(conditions, varsMap, props);
    return { ...attributes, ...validProps };
  };
}

/**
 * Filter props with a starting letter
 * https://styled-components.com/docs/api#transient-props
 */
function forwardProps(props?: Record<string, unknown>) {
  let validProps = {};
  for (const key in props) {
    if (options.shouldForwardProp(key, props[key]))
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

export function replaceFuncsWithVars<T>(css: Ruleset<T>, varsMap: VarMap) {
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
