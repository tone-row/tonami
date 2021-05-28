import { expandVariablesObject } from "./helpers";

describe("expandVariablesObject", () => {
  test("should return an object one level deep", () => {
    const input = { colors: { red: "red", blue: "blue" } };
    const result = expandVariablesObject(input);
    expect(result).toEqual({ "--colors-red": "red", "--colors-blue": "blue" });
  });
});
