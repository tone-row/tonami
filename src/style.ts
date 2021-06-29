import { useRef } from "react";
import { getUniqueId } from "./lib/getUniqueId";
import { useStyleSheet } from "./sheet";

/**
 * Creates static style once
 */
export const createStyle = (function () {
  let id = getUniqueId();
  return function (CSS: string) {
    const sheet = useStyleSheet();
    sheet.setStyle(id, CSS);
  };
})();

/**
 * Creates style, updates on changes
 */
export function useStyle(id: string, CSS: string) {
  const sheet = useStyleSheet();
  // Begin with ref empty
  const prevCSS = useRef("");
  const hasChanged = CSS !== prevCSS.current;
  if (hasChanged) {
    sheet.setStyle(id, CSS);
    prevCSS.current = CSS;
  }

  return () => sheet.removeStyle(id);
}
