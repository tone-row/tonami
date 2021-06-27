import React from "react";
import { DEFAULT_STYLE_TAG_ID } from "./lib/constants";
import { useStyleSheet } from "./stylesheet";

export function ServerStylesheet() {
  const sheet = useStyleSheet();
  return (
    <style
      id={DEFAULT_STYLE_TAG_ID}
      dangerouslySetInnerHTML={{ __html: sheet.getStyleString() }}
    />
  );
}
