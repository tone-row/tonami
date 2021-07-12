/** Get the CSSStyleSheet instance for a given style element... borrowed from SC~!! */
export const getSheet = (tag: HTMLStyleElement): CSSStyleSheet => {
  if (tag.sheet) {
    return tag.sheet;
  }

  // Avoid Firefox quirk where the style element might not have a sheet property
  const { styleSheets } = document;
  for (let i = 0, l = styleSheets.length; i < l; i++) {
    const sheet = styleSheets[i];
    if (sheet.ownerNode === tag) {
      return sheet;
    }
  }

  throw new Error("Unable to get CSSStyleSheet");
};
