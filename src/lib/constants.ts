export const IS_BROWSER =
  typeof window !== "undefined" && "HTMLElement" in window;

export const DEFAULT_STYLE_TAG_ID = "tonami";
export const SSR_STYLE_TAG_ID = "tonami-ssr";

export const options = {
  shouldForwardProp(key: string, _value: unknown) {
    return key[0] !== "$";
  },
};
