import { v } from "./vars";

describe("vars", () => {
  it("should return a string for nested objects", () => {
    expect(v.test.fun.toString()).toEqual("var(--test-fun)");
  });
});
