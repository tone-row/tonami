import { useState, useEffect } from "react";
import { getUniqueId } from "./lib/getUniqueId";
import { selectorsToString } from "./helpers";
import { createStyle, useStyle } from "./style";
import { Selectors } from "./lib/types";

/**
 * Write static CSS
 */
export function css(args: Selectors) {
  createStyle(selectorsToString(args));
}

/**
 * Write dynamic css, removed on unmount
 */
export function useCss(args: Selectors) {
  const [elementId] = useState(getUniqueId());
  const removeStyle = useStyle(elementId, selectorsToString(args));
  useEffect(() => {
    return removeStyle;
  }, []);
}
