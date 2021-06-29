export const IS_BROWSER =
  typeof window !== "undefined" && "HTMLElement" in window;

export const DEFAULT_STYLE_TAG_ID = "tonami";

export const options = {
  shouldForwardProp: (key: string, value: unknown) => {
    return key[0] !== "$";
  },
};
