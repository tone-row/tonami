import { getByTestId, queryByTestId, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { useStyleSelectors } from ".";

describe("usePermanentStyle", () => {
  it.todo("Should not rerender if the string doesn't change");
});

describe("useStyleSelectors", () => {
  it("should remove style on unmount", async () => {
    const ToggleStyles = () => {
      useStyleSelectors({ body: { css: { color: "red" } } });
      return null;
    };
    const Test = ({ show = true }: { show?: boolean }) => {
      return <div>{show ? <ToggleStyles /> : null}</div>;
    };
    const { rerender } = render(<Test />);

    expect(getByTestId(document.head, "ta0")).toBeInTheDocument();

    rerender(<Test show={false} />);

    expect(queryByTestId(document.head, "ta0")).not.toBeInTheDocument();
  });
});
