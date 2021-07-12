import { getSheet } from "../getSheet";

describe("getSheet", () => {
  it("should return a CSSOM sheet", () => {
    const tag = document.createElement("style");
    document.head.appendChild(tag);
    const sheet = getSheet(tag);
    expect(typeof sheet).toEqual("object");
    expect(Object.keys(sheet)).toContain("parentStyleSheet");
    expect(Object.keys(sheet)).toContain("cssRules");
  });

  it("should throw if can't return sheet", () => {
    const get = () => getSheet({} as HTMLStyleElement);
    expect(get).toThrow();
  });

  it("should attempt to return sheet in FF", () => {
    const tag = {} as HTMLStyleElement;
    const sheet = { ownerNode: tag } as unknown as CSSStyleSheet;
    Object.defineProperty(document, "styleSheets", {
      get: () => [sheet] as unknown as StyleSheetList,
    });

    Object.assign(document);
    expect(getSheet(tag)).toEqual(sheet);
  });
});
