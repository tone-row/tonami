import "@testing-library/jest-dom/extend-expect";

import { DEFAULT_STYLE_TAG_ID, SSR_STYLE_TAG_ID } from "../lib/constants";

describe("stylesheet", () => {
  afterEach(() => {
    // Need to clear the DOM
    document.getElementsByTagName("html")[0].innerHTML =
      "<head></head><body></body>";
    jest.resetModules();
  });

  it("should return rule indexes when inserting dynamic rules", () => {
    const { sheet } = require("../sheet");
    const ruleIds = sheet.insertDynamicRules([
      "body { background-color: red; }",
      "html { color: red; }",
    ]);
    expect(ruleIds).toEqual([1, 0]);
  });

  it("should get tag if tag present", () => {
    let tag = document.createElement("style");
    tag.setAttribute("id", DEFAULT_STYLE_TAG_ID);
    document.head.appendChild(tag);
    const { sheet } = require("../sheet");

    expect(sheet.tag).toEqual(tag);

    // Intentionall unset tag to test findOrCreateTag return
    sheet.tag = null;
    expect(sheet.tag).toEqual(null);
    expect(document.querySelector("style")).toEqual(tag);

    expect(sheet.findOrCreateTag()).toEqual(tag);

    sheet.tag = tag;
    expect(sheet.findOrCreateTag()).toEqual(tag);
  });

  it("should remove SSR tag", () => {
    const tag = document.createElement("style");
    tag.setAttribute("id", SSR_STYLE_TAG_ID);
    tag.setAttribute("data-testid", "ssr");
    document.head.appendChild(tag);
    expect(document.querySelector("[data-testid='ssr']")).toBeInTheDocument();
    require("../sheet");
    expect(
      document.querySelector("[data-testid='ssr']")
    ).not.toBeInTheDocument();
  });

  it("should keep vaid references to rules", () => {
    const { sheet } = require("../sheet");
    const red = sheet.insertDynamicRules(["a { color: red; }"]);
    const green = sheet.insertDynamicRules(["a { color: green; }"]);
    const blue = sheet.insertDynamicRules(["a { color: blue; }"]);
    expect(sheet.rules).toContain("a { color: red; }");
    expect(sheet.rules).toContain("a { color: green; }");
    expect(sheet.rules).toContain("a { color: blue; }");
    sheet.removeRules(green);
    expect(sheet.rules).toContain("a { color: red; }");
    expect(sheet.rules).not.toContain("a { color: green; }");
    expect(sheet.rules).toContain("a { color: blue; }");
    sheet.removeRules(blue);
    expect(sheet.rules).toContain("a { color: red; }");
    expect(sheet.rules).not.toContain("a { color: blue; }");
    sheet.removeRules(red);
    expect(sheet.rules).toHaveLength(0);
  });
});
