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

  it("should accept an as prop to change the DOM element", () => {
    const Text = styled.span();
    const Test = () => (
      <Text data-testid="h1" as="h1">
        This is an h1
      </Text>
    );
    const { getByTestId } = render(<Test />);
    const h1 = getByTestId("h1");
    expect(h1.tagName).toEqual("H1");
  });
});
