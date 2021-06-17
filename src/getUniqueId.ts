let uniqueId = 0;

/**
 * @returns A unique id for a <style/> tag
 */
export function getUniqueId() {
  return `t${uniqueId++}`;
}
