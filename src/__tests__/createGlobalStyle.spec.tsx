import React from "react";
import { createGlobalStyle } from "../createGlobalStyle";
import { render } from "@testing-library/react";
import { sheet } from "../sheet";

describe("createGlobalStyle", () => {
  it("returns something to be rendered", () => {
    const Global = createGlobalStyle({});
    render(<Global />);
  });

  it("adds styles to DOM", async () => {
    const Global = createGlobalStyle<{ $size: number }>({
      html: {
        color: "red",
        fontSize: ({ $size }) => $size + "px",
      },
    });
    render(
      <div>
        <Global $size={16} />
      </div>
    );
    expect(sheet.rules).toContain("html { color: red; font-size: 16px; }");
  });

  it("updates styles added to the DOM", () => {
    const Global = createGlobalStyle<{ $color: string }>({
      html: {
        color: (props) => props.$color,
      },
    });
    const { rerender } = render(<Global $color="red" />);
    expect(sheet.rules).toContain("html { color: red; }");
    rerender(<Global $color="blue" />);
    expect(sheet.rules).toContain("html { color: blue; }");
    expect(sheet.rules).not.toContain("html { color: red; }");
  });
});
