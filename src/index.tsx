import React, { useEffect, useRef, useState } from "react";
import {
  buildCssString,
  prepareClassNames,
  prepareCssVars,
  selectorsToString,
} from "./helpers";
import { Selectors, Options, UseClassGroup, VarMap, Apply } from "./types";

// Keeps initial server-rendered styels in memory
// For SSR
let memory: Record<string, string> = {};

let uniqueId = 0;
/**
 * @returns A unique id for a <style/> tag
 */
export function getUniqueId() {
  return `ta${uniqueId++}`;
}

let uniqueClassName = 0;
/**
 * @returns A unique classname for a style object
 */
export function getUniqueClassName() {
  return `ta${uniqueClassName++}`;
}

/**
 * Create Style Tag or Return if it already exists
 *
 * Should work inside or outside react tree
 * @param elementId ID to be used
 * @param css Optional intial css to write to tag/memory
 * @returns style tag if it exists, null if not
 */
function getStyleTag(elementId: string, css: string) {
  // Register the style tag if on server
  if (typeof document === "undefined") {
    memory[elementId] = css;
    return null;
  }

  const tag = document.getElementById(elementId);

  // Return tag if it arleady exists
  if (tag) return tag;

  // Create it if not
  const style = document.createElement("style");
  style.setAttribute("id", elementId);
  style.setAttribute("data-testid", elementId);
  style.innerHTML = css; // initial string
  document.head.appendChild(style);
  return style;
}

/**
 * Creates style once but will never create it again
 * @returns nothing
 */
const createStyle = (function () {
  let hasRun = false;
  return function (css: string) {
    if (!hasRun) {
      getStyleTag(getUniqueId(), css);
    }
  };
})();

/**
 * Writes to a <style/> element in the head. Creates element if it doesn't exist
 * @param id The id of the style tag to be used
 * @param css The css string to be written
 */
function useStyle(id: string, css: string) {
  const styleTag = getStyleTag(id, css);
  const lastCss = useRef(css);

  // Add to memory for SSR
  if (!styleTag) {
    memory[id] = css;
  }

  if (styleTag && lastCss.current !== css) {
    styleTag.innerHTML = css;
    lastCss.current = css;
  }

  return styleTag;
}

export function styleSelectors(args: Selectors) {
  createStyle(selectorsToString(args));
}

/**
 * Write styles (properties and variables) inside the react tree
 * @param args
 * @returns
 */
export function useStyleSelectors(args: Selectors) {
  const [elementId] = useState(getUniqueId());
  const tag = useStyle(elementId, selectorsToString(args));

  useEffect(() => {
    return () => {
      if (tag) tag.remove();
    };
  }, []);

  return;
}

function applyToString(apply: Apply): string {
  if ("className" in apply) {
    return `.${apply.className}`;
  }
  if (apply.attribute.length === 1) {
    return `[${apply.attribute[0]}]`;
  }
  return `[${apply.attribute[0]}="${apply.attribute[1]}"]`;
}

export function makeClasses<T>(...styles: Options<T>[]): UseClassGroup<T> {
  // Prepare permanent html + classNamesObject
  let permanentHtml = ``;
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

    permanentHtml += buildCssString(
      conditionalStyle.styles,
      conditionBaseSelector,
      varMap
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

  // Runtime functions for className, style, attributes
  const getClassNames = prepareClassNames(classNameMap);
  const getCssVars = prepareCssVars(varMap);
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
  const elementId = getUniqueId();

  // Get Classes
  const useClassGroup = (args: T) => {
    // Permanent CSS styles are set first
    useStyle(elementId, permanentHtml.trim());
    return {
      className: getClassNames(args),
      style: getCssVars(args),
      ...getAttributes(args),
    };
  };

  return useClassGroup;
}

// Borrowing this idea from styled-jsx
// https://github.com/vercel/styled-jsx#styled-jsxserver
/**
 * Function keeps <style>'s created on the server in memory and
 * returns them as an array of react elements to be used
 * in the next document to enable server side rendering
 */
export function ServerStyles() {
  let styles = [];
  for (const id in memory) {
    styles.push(
      <style id={id} key={id}>
        {memory[id]}
      </style>
    );
  }
  // naive attempt is just to erase everything in memory
  memory = {};
  return <>{styles}</>;
}
