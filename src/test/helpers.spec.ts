import { applyToSelector, objectToString } from "../helpers";

describe("applyToString", () => {
  it("should work on classnames", () => {
    const selector = applyToSelector({ className: "test" });
    expect(selector).toEqual(".test");
  });

  it("should work on attributes", () => {
    const selector = applyToSelector({ "aria-current": "page" });
    expect(selector).toEqual("[aria-current=page]");
  });

  it("should work when multiple attributes present", () => {
    const selector = applyToSelector({
      "aria-current": "page",
      className: "test",
    });
    expect(selector).toEqual("[aria-current=page].test");
  });
});

describe("objectToString", () => {
  it("should work on css custom properties and css", () => {
    // @ts-ignore
    expect(objectToString({ color: "blue", "--test": 15 })).toEqual(
      "color: blue; --test: 15;"
    );
  });
});
