import React from "react";
import { SSR_STYLE_TAG_ID } from "./lib/constants";
import { sheet } from "./sheet";

export function ServerStylesheet() {
  return (
    <style
      id={SSR_STYLE_TAG_ID}
      dangerouslySetInnerHTML={{ __html: sheet.getStyleString() }}
    />
  );
}
