import { CSSProperties } from "react";
declare type Vars = {
    [K in string]: string | number | Vars;
};
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
export declare function transformVars(vars: Vars, start?: string): {};
export declare function makeStyleTag(): HTMLStyleElement;
export declare function createDynamicTag(): (selector: string, vars: Vars) => void;
export declare function useDynamicStyle(vars: Vars): CSSProperties;
export {};
