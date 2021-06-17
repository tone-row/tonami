import { CSSProperties } from "react";
import {
  applyToString,
  buildCssString,
  removeUnderscoreAttributes,
} from "./helpers";
import { useStyle } from "./style";
import { getUniqueId } from "./getUniqueId";
import { getUniqueClassName } from "./getUniqueClassName";
import { Apply, Options, UseClassGroup, VarMap } from "./types";

export function classes<T>(...styles: Options<T>[]): UseClassGroup<T> {
  // Prepare permanent html + classNamesObject
  let permanentHtml: string[] = [];
  let classNameMap = {}; // stores conditional classnames for runtime processing
  let attributeMap = {}; // stores conditional attributes for runtime processing
  let attributeDefaultsMap = {}; // stores what the end result of att should be if true
  let varMap: VarMap = {}; // stores css variabls for runtime processing

  const baseClass = getUniqueClassName();

  // Attach base class to classnamesmap so we always return that class
  classNameMap[baseClass] = true;

  for (const conditionalStyle of styles) {
    let apply: Apply;
    // Check if there is a method to apply the style
    if (conditionalStyle.apply && "attribute" in conditionalStyle.apply) {
      apply = conditionalStyle.apply;

      // Add this attribute to the default map so we now what to apply at runtime
      attributeDefaultsMap[conditionalStyle.apply.attribute[0]] =
        conditionalStyle.apply.attribute.length === 2
          ? conditionalStyle.apply.attribute[1]
          : true;
    } else if (
      conditionalStyle.apply &&
      "className" in conditionalStyle.apply
    ) {
      apply = conditionalStyle.apply;
    } else {
      apply = { className: getUniqueClassName() };
    }

    // If no method, generate class name
    let conditionBaseSelector =
      typeof conditionalStyle.condition === "undefined"
        ? `.${baseClass}`
        : `.${baseClass}${applyToString(apply)}`;

    permanentHtml.push(
      buildCssString(conditionalStyle.styles, conditionBaseSelector, varMap)
    );

    if (typeof conditionalStyle.condition === "undefined") {
      if ("className" in apply) {
        classNameMap[apply.className] = true;
      } else {
        attributeMap[apply.attribute[0]] =
          apply.attribute.length == 2 ? apply.attribute[1] : true;
      }
    } else {
      if ("className" in apply) {
        classNameMap[apply.className] = conditionalStyle.condition;
      } else {
        attributeMap[apply.attribute[0]] = conditionalStyle.condition;
      }
    }
  }

  /**
   * Get classnames at runtime depending on arguments to hook
   */
  function getClassNames(args: T) {
    let classes = [];
    for (const key in classNameMap) {
      let value = classNameMap[key];
      // If function and result true
      if (typeof value === "function" && Boolean(value(args))) {
        classes.push(key);
      } else if (typeof value !== "function" && value) {
        // Or if true
        classes.push(key);
      }
    }
    return classes.join(" ");
  }

  /**
   * Get attributes at runtime depending on arguments to hook
   */
  function getAttributes(props: T) {
    let attributes: Record<string, any> = {};
    for (const attribute in attributeMap) {
      if (typeof attributeMap[attribute] === "function") {
        const result = attributeMap[attribute](props);
        if (result) {
          attributes[attribute] = attributeDefaultsMap[attribute];
        }
      } else {
        attributes[attribute] = attributeDefaultsMap[attribute];
      }
    }
    return attributes;
  }

  /**
   * function can be called with args to
   * dynamically assign values to css variables
   */
  function getCssVars(args: T) {
    let style = {};
    for (const key in varMap) {
      style[key] = varMap[key](args);
    }
    return style as CSSProperties;
  }

  const elementId = getUniqueId();

  // Get Classes
  const useClassGroup = (args: T) => {
    // Permanent CSS styles are set first
    useStyle(elementId, permanentHtml.join(" "));
    const elementProps = removeUnderscoreAttributes(args);
    return {
      className: getClassNames(args),
      style: getCssVars(args),
      ...getAttributes(args),
      ...elementProps,
    };
  };

  return useClassGroup;
}
