import React from "react";
import { DEFAULT_STYLE_TAG_ID } from "./constants";
import { useStyleSheet } from "./StyleSheet";

export function ServerStyle() {
  const sheet = useStyleSheet();
  return (
    <style
      id={DEFAULT_STYLE_TAG_ID}
      dangerouslySetInnerHTML={{ __html: sheet.getStyleString() }}
    />
  );
}
