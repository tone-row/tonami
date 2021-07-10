import { useRef } from "react";
import { getUniqueId } from "./lib/getUniqueId";
import { mainSheet } from "./sheet";

/**
 * Creates static style once
 */
export const createStyle = (function () {
  let id = getUniqueId();
  return function (CSS: string) {
    mainSheet.setStyle(id, CSS);
  };
})();

/**
 * Creates style, updates on changes
 */
export function useStyle(id: string, CSS: string) {
  // Begin with ref empty
  const prevCSS = useRef("");
  const hasChanged = CSS !== prevCSS.current;
  if (hasChanged) {
    mainSheet.setStyle(id, CSS);
    prevCSS.current = CSS;
  }

  return () => mainSheet.removeStyle(id);
}
