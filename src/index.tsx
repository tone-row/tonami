import { Properties } from "csstype";
import React, { useEffect, useRef, useState } from "react";
import {
  expandVariablesObject,
  objectToString,
  prepareClassNames,
  prepareCssVars,
  selectorsToString,
} from "./helpers";
import { Selectors, Options, UseClassGroup, VarMap } from "./types";

// Keeps initial server-rendered styels in memory
// For SSR
let memory: Record<string, string> = {};

let uniqueId = 0;
/**
 * @returns A unique id for a <style/> tag
 */
function getUniqueId() {
  return `cssvars-${uniqueId++}`;
}

let uniqueClassName = 0;
/**
 * @returns A unique classname for a style object
 */
export function getUniqueClassName() {
  return `cssvarsclass${uniqueClassName++}`;
}

let uniqueCssVariableName = 0;
function getUniqueCssVariableName() {
  return `--v${uniqueCssVariableName++}`;
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

  // Remove Tag on Unmount
  // useEffect(() => {
  //   return () => {
  //     debugger;
  //     if (styleTag) styleTag.remove();
  //   };
  // }, []);

  // No idea if this is effectual and needs to be treated as such
  // useEffect(() => {
  // }, [cssString]);
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

/**
 * Takes a css object that may have functions for some properties
 * and adds the function to the passed in varMap, removes function
 * from the css object and replaces it with
 *
 * __not sure__
 *
 * probably just the variable string I guess
 */
function replaceVarFunctionsWithVars<T>(
  css: Options<T>["css"],
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

export function createClassGroup<T>(...cssArgs: Options<T>[]): {
  useClassGroup: UseClassGroup<T>;
} {
  // Prepare permanent html + classNamesObject
  let permanentHtml = ``;
  let classNamesMap = {}; // stores conditions for runtime processing
  let varMap: VarMap = {}; // stores css variabls for runtime processing

  for (const cssArg of cssArgs) {
    // generate class
    const className = getUniqueClassName();
    const { css: cssWithVarFunctions = {}, vars = {} } = cssArg;
    const css = replaceVarFunctionsWithVars(cssWithVarFunctions, varMap);
    const variablesString = objectToString(expandVariablesObject(vars));
    const cssString = objectToString(css, true);
    permanentHtml += `.${className} { ${variablesString} ${cssString} }`;
    classNamesMap[className] =
      typeof cssArg.condition === "undefined" ? true : cssArg.condition;
  }

  // get classnames function
  const classNames = prepareClassNames(classNamesMap);
  const getCssVars = prepareCssVars(varMap);
  const elementId = getUniqueId();

  // Get Classes
  const useClassGroup = (args: T) => {
    // Permanent CSS styles are set first
    useStyle(elementId, permanentHtml.trim());
    return { className: classNames(args), style: getCssVars(args) };
  };

  return { useClassGroup };
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

// type PolymorphicComponentProps<C extends ElementType> = {
//   as?: C;
//   children?: ReactNode;
// };

// export function createPolymorphicComponent<F extends ElementType>({
//   defaultElement,
// }: {
//   defaultElement: F;
// }) {
//   const Component = <E extends ElementType = F>({
//     as,
//     ...props
//   }: PolymorphicComponentProps<E> &
//     Omit<ComponentPropsWithRef<E>, keyof PolymorphicComponentProps<E>>) => {
//     let As = as || defaultElement;
//     return <As {...props} />;
//   };
//   //
//   return Component;
// }

export { v } from "./vars";
export { expandVariablesObject };
