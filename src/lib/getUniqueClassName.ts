let uniqueClassName = 0;
/**
 * @returns A unique classname for a style object
 */
export function getUniqueClassName() {
  return `ta${uniqueClassName++}`;
}
