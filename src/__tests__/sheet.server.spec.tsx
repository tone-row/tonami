/**
 * @jest-environment node
 */

import { mainSheet } from "../sheet";

describe("stylesheet", () => {
  it("should return null if no tag & not in browser", () => {
    expect(mainSheet.tag).toEqual(null);
  });
});
