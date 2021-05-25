import { transformVars } from "./index";

describe("transformVars", () => {
  test("should return an object one level deep", () => {
    const input = { colors: { red: "red", blue: "blue" } };
    const result = transformVars(input);
    expect(result).toEqual({ "--colors-red": "red", "--colors-blue": "blue" });
  });
});
