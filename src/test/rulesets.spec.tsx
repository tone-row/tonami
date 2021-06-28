import { render } from "@testing-library/react";
import React from "react";
import { options } from "../lib/constants";
import { replaceFuncsWithVars, rulesets } from "../rulesets";

describe("rulesets", () => {
  it("returns a hook which returns classnames", () => {
    const useRulesets = rulesets();
    expect(typeof useRulesets).toBe("function");
    const Test = () => {
      const atts = useRulesets();
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    expect(div.classList.contains("ta0")).toBe(true);
  });

  test("can apply using a custom class", () => {
    const customClass = "custom";
    const useRulesets = rulesets({
      color: "orange",
      apply: { className: customClass },
    });
    const Test = () => {
      const atts = useRulesets();
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    expect(div.classList.contains(customClass)).toBe(true);
  });

  test("can apply using an attribute", () => {
    const customAtt = "aria-disabled";
    const useRulesets = rulesets({
      color: "orange",
      apply: { [customAtt]: true },
    });
    const Test = () => {
      const atts = useRulesets();
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    expect(div.getAttribute(customAtt)).toBeTruthy();
  });

  test("can apply rulesets conditionally", () => {
    const useRulesets = rulesets<{ _isOrange: boolean; _isBlue: boolean }>(
      {
        color: "orange",
        condition: ({ _isOrange }) => _isOrange,
      },
      {
        color: "blue",
        condition: ({ _isBlue }) => _isBlue,
      }
    );
    const Test = ({
      isBlue,
      isOrange,
    }: {
      isOrange: boolean;
      isBlue: boolean;
    }) => {
      const atts = useRulesets({ _isBlue: isBlue, _isOrange: isOrange });
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId, rerender } = render(
      <Test isBlue={false} isOrange={true} />
    );
    const div = getByTestId("div");
    // base class + isOrange class
    expect(div.classList.length).toEqual(2);

    rerender(<Test isBlue={true} isOrange={true} />);
    expect(div.classList.length).toEqual(3);
  });

  it("replaces css functions with variables", () => {
    const useRulesets = rulesets<{ c: string }>({
      color: ({ c }) => c,
    });
    const Test = ({ c }: { c: string }) => {
      const atts = useRulesets({ c });
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId } = render(<Test c="green" />);
    const div = getByTestId("div");
    expect(div.style.getPropertyValue("--ta0")).toBe("green");
  });

  it("handles subselectors", () => {
    const useRulesets = rulesets({
      color: "blue",
      selectors: {
        "& h1 {}": { color: "red" },
      },
    });
    const Test = () => {
      const atts = useRulesets();
      return (
        <div {...atts}>
          <h1 data-testid="h1">Test</h1>
        </div>
      );
    };
    const { getByTestId } = render(<Test />);
    const h1 = getByTestId("h1");
    expect(window.getComputedStyle(h1).getPropertyValue("color")).toEqual(
      "red"
    );
  });

  test("can change starting letter", () => {
    options.startingLetter = "$";
    const useRulesets = rulesets<{ $color: string }>({
      color: ({ $color }) => $color,
    });
    const Test = () => {
      // @ts-ignore
      const atts = useRulesets({ $color: "green", _original_letter: "test" });
      return <div data-testid="div" {...atts} />;
    };
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div");
    expect(div.getAttribute("$color")).toEqual(null);
    expect(div.getAttribute("_original_letter")).not.toEqual(null);
  });
});

describe("replaceFuncsWithVars", () => {
  it("should return an empty object if passed one", () => {
    expect(replaceFuncsWithVars(false as any, {})).toEqual({});
  });
});
