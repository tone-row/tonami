import { getUniqueClassName } from "../getUniqueClassName";

describe("getUniqueClassName", () => {
  it("should return a classname", () => {
    expect(getUniqueClassName(JSON.stringify({}))).toEqual("TA57efd");
    expect(getUniqueClassName(JSON.stringify({ test: 4 }))).toEqual(
      "TAecb8fa0f"
    );
    expect(
      getUniqueClassName(
        JSON.stringify({ test: 4, muchLarger: "test", anyObj: () => {} })
      )
    ).toEqual("TAf31fdec7");
  });
});
