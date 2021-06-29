import { render, waitFor } from "@testing-library/react";
import React from "react";
import { css, useCss } from "../css";

describe("css", () => {
  test("it can write static css with selector", async () => {
    css({ "[data-testid=div]": { color: "red" } });
    const Test = () => <div data-testid="div">What color am I?</div>;
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    await waitFor(() => {
      expect(window.getComputedStyle(div).getPropertyValue("color")).toEqual(
        "red"
      );
    });
  });
});

describe("useCss", () => {
  test("it can write dynamic styles with selectors", async () => {
    const Test = ({ color }: { color: string }) => {
      useCss({ h1: { color } });
      return <h1 data-testid="h1">What color am I!?</h1>;
    };
    const { getByTestId, rerender } = render(<Test color="orange" />);
    const h1 = getByTestId("h1");
    await waitFor(() => {
      expect(window.getComputedStyle(h1).getPropertyValue("color")).toEqual(
        "orange"
      );
    });

    rerender(<Test color="blue" />);
    await waitFor(() => {
      expect(window.getComputedStyle(h1).getPropertyValue("color")).toEqual(
        "blue"
      );
    });
  });
});
