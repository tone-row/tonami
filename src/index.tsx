import React, { useEffect, useRef } from "react";
import {
  expandVariablesObject,
  objectToString,
  prepareClassNames,
} from "./helpers";
import { Selectors, Options, GetClasses } from "./types";

// Keeps initial server-rendered styels in memory
// For SSR
const memory: Record<string, string> = {};

let uniqueId = 0;
function getUniqueStyleTagId() {
  return `cssvars-${uniqueId++}`;
}

let uniqueClassname = 0;
function getUniqueClassName() {
  return `cssvarsclass${uniqueClassname++}`;
}

// Create Style Tag or Return if it already exists
function useStyleTag(elementId: string) {
  // Here is where we precreate the style tag
  if (typeof document === "undefined") {
    memory[elementId] = ``;
    return null;
  }
  const tag = document.getElementById(elementId);
  if (tag) return tag;
  const style = document.createElement("style");
  style.setAttribute("id", elementId);
  document.head.appendChild(style);
  return style;
}

/**
 * The idea is that this will only get called once
 * For our css
 */
function usePermanentStyle(cssString: string) {
  const elementId = useRef(getUniqueStyleTagId()); // why is this generating a new ID each time...
  const styleTag = useStyleTag(elementId.current);
  // No idea if this is effectual and needs to be treated as such
  useEffect(() => {
    if (styleTag) {
      styleTag.innerHTML = cssString;
    } else {
      // Add to memory for SSR
      memory[elementId.current] = cssString;
    }
  }, [styleTag, cssString]);
}

// Depending on whether internal function return StyleTuple or Selectors
export function useCss(args: Selectors) {
  const elementId = useRef(getUniqueStyleTagId());
  const styleTag = useStyleTag(elementId.current);

  let html = ``;
  for (const selector in args) {
    const { vars = {}, css = {} } = args[selector];
    const obj = expandVariablesObject(vars);
    html += `${selector} { ${objectToString(obj)} ${objectToString(
      css,
      true
    )} }\n`;
  }
  if (styleTag) {
    styleTag.innerHTML = html;
  } else {
    // store it in memory
    memory[elementId.current] = html;
  }
  return;
}

export function createClassGroup<T>(...cssArgs: Options<T>[]): GetClasses<T> {
  // Prepare permanent html + classNamesObject
  let permanentHtml = ``;
  let classNamesObject = {};
  for (const cssArg of cssArgs) {
    // generate class
    const className = getUniqueClassName();
    const { css = {}, vars = {} } = cssArg;
    permanentHtml += `.${className} { ${objectToString(
      expandVariablesObject(vars)
    )} ${objectToString(css, true)} }`;
    classNamesObject[className] =
      typeof cssArg.apply === "undefined" ? true : cssArg.apply;
  }

  // get classnames function
  const classNames = prepareClassNames(classNamesObject);

  // Get Classes
  return (args: T) => {
    // Permanent CSS styles are set first
    usePermanentStyle(permanentHtml);
    return classNames(args);
  };
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
  return <>{styles}</>;
}

export { v } from "./vars";
export { expandVariablesObject };
