import { CSSProperties } from "react";

type Vars = { [K in string]: string | number | Vars };

function isVars(o: unknown): o is Vars {
  return typeof o === "object";
}

/**
 * Takes a nested object and returns an object with all of the keys
 * converted to css property names using a "-" to adjoin childnames
 * to their parent
 *
 * Input:
 * { colors: { red: 'red', blue: 'blue' } }
 *
 * Output:
 * { "--colors-red": 'red', "--colors-blue": 'blue' }
 */
export function transformVars(vars: Vars, start = "-") {
  let o = {};
  for (const key in vars) {
    let value = vars[key];
    let fullKey = [start, key].filter(Boolean).join("-");
    if (isVars(value)) {
      o = { ...o, ...transformVars(value, fullKey) };
    } else {
      o[fullKey] = value;
    }
  }

  return o;
}

function objectToString(obj: Record<string, string | number>) {
  let str = "";
  for (const key in obj) {
    str += `${key}: ${obj[key]};`;
  }
  return str;
}

let uniqueId = 0;
export function makeStyleTag() {
  const style = document.createElement("style");
  style.setAttribute("id", `cssvars${uniqueId}`);
  document.head.appendChild(style);
  return style;
}

// either a selector string, or an element ref
export function createDynamicTag() {
  const style = makeStyleTag();
  return (selector: string, vars: Vars) => {
    const obj = transformVars(vars);
    style.innerHTML = `${selector} { ${objectToString(obj)} }`;
  };
}

export function useDynamicStyle(vars: Vars) {
  return transformVars(vars) as CSSProperties;
}
