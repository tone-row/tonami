import { Properties } from "csstype";
import React, { useRef } from "react";
import { transformVars, objectToString, prepareClassNames } from "./helpers";
import {
  StyleTuple,
  Selectors,
  ReturnComponentProps,
  Options,
  Vars,
} from "./types";

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
  const elementId = useRef(getUniqueStyleTagId());
  const styleTag = useStyleTag(elementId.current);
  if (styleTag) {
    styleTag.innerHTML = cssString;
  } else {
    // Add to memory for SSR
    memory[elementId.current] = cssString;
  }
  // No idea if this is effectual and needs to be treated as such
  // useEffect(() => {
  // }, [styleTag, cssString]);
}

function isStyleTuple(x: unknown): x is StyleTuple {
  return Array.isArray(x);
}

export function useCss(args: StyleTuple): ReturnComponentProps;
export function useCss(args: Selectors): void;
// Depending on whether internal function return StyleTuple or Selectors
export function useCss(args: StyleTuple | Selectors) {
  const elementId = useRef(getUniqueStyleTagId());
  const className = useRef(getUniqueClassName()); // Possibly unused
  const styleTag = useStyleTag(elementId.current);

  if (!isStyleTuple(args)) {
    let html = ``;
    for (const selector in args) {
      const { 0: vars = {}, 1: css = {} } = args[selector];
      const obj = transformVars(vars);
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

  const { 0: vars = {}, 1: css = {} } = args;
  const style = transformVars(vars);
  let html = ``;
  html += `.${className.current} { ${objectToString(css, true)}`;
  if (styleTag) {
    styleTag.innerHTML = html;
  } else {
    // store it in memory
    memory[elementId.current] = html;
  }

  return { className: className.current, style };
}

function isOptions(x: any): x is Options {
  return "css" in x;
}

type MakeCssArg = Properties | Options;
type MakeCssHook = (vars?: Vars) => ReturnComponentProps;
export function makeCss(
  firstArg: MakeCssArg,
  ...args: MakeCssArg[]
): MakeCssHook;
export function makeCss<T>(
  firstArg: (args: T) => StyleTuple,
  ...args: MakeCssArg[]
): MakeCssHook;
export function makeCss<T>(
  firstArg: MakeCssArg | ((args: T) => StyleTuple),
  ...args: MakeCssArg[]
) {
  // First we need to make a class for every option
  let cssArgs = typeof firstArg === "function" ? args : [firstArg, ...args];

  // Prepare permanent html + classNamesObject
  let permanentHtml = ``;
  let classNamesObject = {};
  for (const cssArg of cssArgs) {
    // generate class
    const className = getUniqueClassName();
    if (isOptions(cssArg)) {
      permanentHtml += `.${className} { ${objectToString(cssArg.css, true)} }`;
      classNamesObject[className] =
        typeof cssArg.apply === "undefined" ? true : cssArg.apply;
    } else {
      permanentHtml += `.${className} { ${objectToString(cssArg, true)} }`;
      classNamesObject[className] = true;
    }
  }

  // get classnames function
  const classNames = prepareClassNames(classNamesObject);

  return (args: Vars) => {
    // Permanent CSS styles are set first
    usePermanentStyle(permanentHtml);
    const className = classNames(args);
    return { className, style: transformVars(args) };
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
