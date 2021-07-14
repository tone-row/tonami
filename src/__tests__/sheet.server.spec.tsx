/**
 * @jest-environment node
 */

import { sheet } from "../sheet";
import { styled } from "../styled";

describe("stylesheet", () => {
  it("should return null if no tag & not in browser", () => {
    expect(sheet.tag).toEqual(null);
  });

  it("should return styles as string", () => {
    styled.div({
      color: "green",
    });
    expect(sheet.getStyleString()).toEqual(
      ".TAcf6141c7.TA212d7b4f { color: green; }"
    );
  });

  it("should reset in the server", () => {
    const { sheet } = require("../sheet");
    sheet.reset();
    expect(sheet.tag).toEqual(null);
    expect(sheet.rules.length).toEqual(0);
  });
});
