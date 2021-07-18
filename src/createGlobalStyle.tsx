import { cssToString } from "./helpers";
import { Selectors, StaticSelectors } from "./lib/types";
import { useRules } from "./useRules";

/**
 * Resolve function values *without* css custom properties
 */
function resolveFnValues<I>(
  decl: Selectors<I>[string],
  props: I
): StaticSelectors {
  let s: StaticSelectors = Object.assign({}, decl);
  for (let key in decl) {
    if (typeof decl[key] === "function") s[key] = decl[key](props);
  }
  return s;
}

function createGlobalStyle<I>(selectors: Selectors<I>) {
  function GlobalStyle(props: I) {
    let rules: string[] = [];

    for (const selector in selectors) {
      rules.push(
        cssToString(selector, resolveFnValues(selectors[selector], props))
      );
    }

    useRules(rules);

    return null;
  }
  return GlobalStyle;
}

export { createGlobalStyle };
