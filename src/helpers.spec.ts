import { expandVars } from "./helpers";

describe("expandVars", () => {
  test("should return an object one level deep", () => {
    let input: Record<string, any> = { colors: { red: "red", blue: "blue" } };
    let result = expandVars(input);
    expect(result).toEqual({ "--colors-red": "red", "--colors-blue": "blue" });

    input = {
      really: { deeply: { nested: { objects: { work: { too: "1000px" } } } } },
    };
    result = expandVars(input);
    expect(result).toEqual({
      "--really-deeply-nested-objects-work-too": "1000px",
    });
  });
});
