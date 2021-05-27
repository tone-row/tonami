## Motivation

I wanted a way to add a sprinkle of dynamic styles to a javascript application that didn't involve too much overhead. By overhead I mean things like, extracting css files, or varying syntax to support certain css features.

I am a huge fan of other CSS-in-JS solutions styled-components, jss, goober. They all have their place. I think the best way I can explain the different approach of this library is that, this is not a library for writing CSS. It's a library for adding dynamic CSS using custom properties, and doing so from the component's perspective.

Having used lots of css-in-js libraries, I don't always enjoy "writing" css in js. Rather, what I want is access to my theme variables when I need them, and a little bit of JS runtime (as needed) to generate values at build time or compile as-needed.

If all of that sounds like something worth trying. Give this package a spin!

//

// // either a selector string, or an element ref
// type CustomPropertySelectors = Record<string, Vars>;
// type CssSelectors = Record<string, Properties>;
// export function createDynamicTag(): (
// cssVars: CustomPropertySelectors,
// css?: CssSelectors
// ) => void;
// export function createDynamicTag<T>(
// preprocess: (args: T) => CustomPropertySelectors
// ): (args: T, css?: CssSelectors) => void;
// export function createDynamicTag<T>(
// preprocess?: (args: T) => CustomPropertySelectors
// ) {
// const id = getUniqueId();

// function useSelectors(
// selectors: CustomPropertySelectors,
// css?: CssSelectors
// ) {
// const style = useStyleTag(id);
// if (style) {
// let html = ``; // for (const selector in selectors) { // const obj = transformVars(selectors[selector]); // html += `${selector} { ${objectToString(obj)} }`;
//       }
//       if (css) {
//         for (const selector in css) {
//           html += `${selector} { ${objectToString(css[selector], true)} }`;
// }
// }
// style.innerHTML = html;
// }
// }

// // Hook for preprocessing
// if (preprocess) {
// return (args: T, css?: CssSelectors) => {
// const selectors = preprocess(args);
// useSelectors(selectors, css);
// };
// }

// return useSelectors;
// }

// export function useDynamicStyle(vars: Vars) {
// return transformVars(vars) as CSSProperties;
// }

// export function useCssVars<T>(
// cssVars: CustomPropertySelectors,
// css?: CssSelectors
// ): void;
// export function useCssVars(
// cssVars: CustomPropertySelectors,
// css?: CssSelectors
// ) {
// const id = useRef(getUniqueId());
// const style = useStyleTag(id.current);
// if (style) {
// let html = ``; // for (const selector in cssVars) { // const obj = transformVars(cssVars[selector]); // html += `${selector} { ${objectToString(obj)} }`;
//     }
//     if (css) {
//       for (const selector in css) {
//         html += `${selector} { ${objectToString(css[selector], true)} }`;
// }
// }
// style.innerHTML = html;
// }
// }

// export function defineDynamicClass<T>(
// preprocess: (args: T) => Vars,
// css?: Properties
// ) {
// const id = getUniqueId();
// const className = getUniqueClassname();
// return function useStyle(args: T) {
// const tag = useStyleTag(id);
// const vars = preprocess(args);
// const style = transformVars(vars);
// if (tag && css) {
// tag.innerHTML = `.${className} { ${objectToString(css, true)} }`;
// }
// return { style, className };
// };
// }
