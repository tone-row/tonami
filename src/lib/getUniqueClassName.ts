let uniqueClassName = 0;
/**
 * @returns A unique classname for a style object
 */
export function getUniqueClassName(str: string) {
  return "TA" + hashFromString(str);
}

/* 
Lifted from goober. Use it instead. It's better.
https://github.com/cristianbote/goober/blob/master/src/core/to-hash.js
*/
let hashFromString = (str: string) => {
  let i = 0,
    out = 37;
  while (i < str.length) out = (97 * out + str.charCodeAt(i++)) >>> 0;
  return out.toString(16);
};
