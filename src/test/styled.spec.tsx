import React from "react";
import styled from "../styled";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("styled", () => {
  it("styleds an element which can be mounted", () => {
    const styledDiv = styled("div");
    expect(typeof styledDiv).toBe("function");
    const Div = styledDiv({ color: "blue" });
    const { getByTestId } = render(<Div data-testid="div">My custom div</Div>);
    const div = getByTestId("div");
    expect(div).toBeInTheDocument();
  });

  it("should not add interface props to the DOM", () => {
    const Div = styled("div")<{ _c: string }>({ color: ({ _c }) => _c });
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
