import React from "react";
import create from "../create";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("create", () => {
  it("creates an element which can be mounted", () => {
    const createDiv = create("div");
    expect(typeof createDiv).toBe("function");
    const Div = createDiv({ color: "blue" });
    const { getByTestId } = render(<Div data-testid="div">My custom div</Div>);
    const div = getByTestId("div");
    expect(div).toBeInTheDocument();
  });

  it("should not add interface props to the DOM", () => {
    const Div = create("div")<{ _c: string }>({ color: ({ _c }) => _c });
    const Test = () => (
      <Div aria-busy _c="orange" data-testid="div">
        Test
      </Div>
    );
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    expect(div.getAttribute("_c")).toBe(null);
  });
});
