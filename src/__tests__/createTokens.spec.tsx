import React from "react";
import { render } from "@testing-library/react";
import { createTokens } from "../createTokens";
import { sheet } from "../sheet";
import { styled } from "../styled";

beforeEach(() => {
  sheet.reset();
});

describe("createTokens", () => {
  test("should have a toStyleObject function property", () => {
    const theme = createTokens({ blue: "#0000ff", inner: { test: "red" } });
    expect(typeof theme.toStyleObject).toEqual("function");
    expect(theme.toStyleObject()).toEqual({
      "--blue": "#0000ff",
      "--inner-test": "red",
    });
    expect(theme.blue).toEqual("var(--blue)");
    expect(theme.inner.test).toEqual("var(--inner-test)");
    expect(JSON.stringify(theme)).toEqual(
      '{"blue":"var(--blue)","inner":{"test":"var(--inner-test)"}}'
    );
  });

  test("returns a Global element for automatic use", () => {
    const theme = createTokens({ primary: "blue", secondary: "red" });
    const { Tokens } = theme;
    const Test = styled.span({ color: theme.primary });
    render(
      <>
        <Tokens />
        <Test>Hello World</Test>
      </>
    );
    expect(sheet.rules).toContain(
      "html { --primary: blue; --secondary: red; }"
    );
    expect(sheet.rules).toMatchInlineSnapshot(`
      Array [
        ".TA3f70c1ae.TAc22dd76 { color: var(--primary); }",
        "html { --primary: blue; --secondary: red; }",
      ]
    `);
  });

  test("can create dynamic token function", () => {
    let light = { fg: "black", bg: "white" };
    let dark = { fg: "white", bg: "black" };
    let themes = { light, dark };
    let theme = createTokens(light);
    let { createDynamicTokens } = theme;
    const DynamicTokens = createDynamicTokens<{ $mode: keyof typeof themes }>(
      ({ $mode }) => themes[$mode]
    );
    const { rerender } = render(<DynamicTokens $mode="light" />);
    expect(sheet.rules).toContain("html { --fg: black; --bg: white; }");
    rerender(<DynamicTokens $mode="dark" />);
    expect(sheet.rules).not.toContain("html { --fg: black; --bg: white; }");
    expect(sheet.rules).toContain("html { --fg: white; --bg: black; }");
    expect(theme.fg).toEqual("var(--fg)");
  });
});
