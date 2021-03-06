import React, { MutableRefObject, useRef } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { styled } from "../styled";
import { sheet } from "../sheet";

describe("styled", () => {
  afterEach(() => {
    sheet.reset();
  });

  it("creates an element which can be mounted", () => {
    const styledDiv = styled("div");
    expect(typeof styledDiv).toBe("function");
    const Div = styledDiv({ color: "blue" });
    const { getByTestId } = render(<Div data-testid="div">My custom div</Div>);
    const div = getByTestId("div");
    expect(div).toBeInTheDocument();
  });

  it("should not add interface props to the DOM", () => {
    const Div = styled("div")<{ $c: string }>({ color: ({ $c }) => $c });
    const Test = () => (
      <Div aria-busy $c="orange" data-testid="div2">
        Test
      </Div>
    );
    const { getByTestId } = render(<Test />);
    const div = getByTestId("div2");
    expect(div.getAttribute("$c")).toBe(null);
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

  it("retains classes and style when passed", () => {
    const Text = styled.span<{ $weight: string }>({
      fontWeight: ({ $weight }) => $weight,
    });
    const Test = () => (
      <Text
        data-testid="span"
        as="div"
        className="hello"
        style={{ fontFamily: "sans-serif" }}
        $weight="700"
      >
        The color should be red
      </Text>
    );
    render(<Test />);
    const span = screen.getByTestId("span");
    expect(span.getAttribute("style")).toMatchInlineSnapshot(
      `"--TAc84292d5-0: 700; font-family: sans-serif;"`
    );
    expect(span.classList.contains("hello")).toBe(true);
    expect(span.style.fontFamily).toEqual("sans-serif");
  });

  it("should compose other styled's", () => {
    const BlueDiv = styled.div<{ $color: string }>({
      color: ({ $color }) => $color,
    });
    const BigBlueDiv = styled(BlueDiv)({
      fontSize: "100px",
    });
    render(<BigBlueDiv $color="orange">Test</BigBlueDiv>);
    expect(screen.getByText("Test").classList.length).toEqual(4);
    expect(screen.getByText("Test").getAttribute("style")).toContain("orange");
  });

  it("styles selectors", async () => {
    const SelectoStyle = styled.div({
      selectors: {
        "& h1 {}": {
          color: "red",
        },
      },
    });
    render(
      <SelectoStyle>
        <h1>Test!</h1>
      </SelectoStyle>
    );
    expect(sheet.rules[1]).toMatchInlineSnapshot(
      `".TA1788df28.TA57efd h1 { color: red; }"`
    );
  });

  it("styles selectors with variable functions", async () => {
    const SelectoStyle = styled.div<{ $color: string }>({
      selectors: {
        "& h1 {}": {
          color: (props) => props.$color,
        },
      },
    });
    render(
      <SelectoStyle $color="green">
        <h1>Test!</h1>
      </SelectoStyle>
    );
    expect(sheet.rules[1]).toMatchInlineSnapshot(
      `".TAf4af03ec.TA57efd h1 { color: var(--TAf4af03ec-0); }"`
    );
  });

  it("different conditions should have different classes", () => {
    const Test = styled.div<{ $color?: string; $fontFamily?: string }>(
      {
        color: ({ $color }) => $color,
        condition: ({ $color }) => $color != null,
      },
      {
        fontFamily: ({ $fontFamily }) => $fontFamily,
        condition: ({ $fontFamily }) => $fontFamily != null,
      }
    );
    render(
      <Test>
        <Test $color="blue">one</Test>
        <Test $fontFamily="cursive">two</Test>
      </Test>
    );
    const one = screen.getByText(/one/);
    const two = screen.getByText(/two/);
    expect(one.classList).not.toEqual(two.classList);
  });

  it("should receive base class no matter what", () => {
    const Test = styled.div({});
    render(<Test as="main">test</Test>);
    const t = screen.getByText(/test/);
    expect(t.classList).toHaveLength(2);
  });

  test("make sure styles only added once", () => {
    const Test = styled.div({ color: "blue" });
    const Test2 = styled.div({ color: "blue" });
    const ToggleTest = ({ x }: { x: boolean }) => {
      return x ? (
        <>
          <Test />
          <Test2 />
        </>
      ) : null;
    };
    render(<ToggleTest x={true} />);
    expect(sheet.rules).toHaveLength(1);
    render(<ToggleTest x={false} />);
    expect(sheet.rules).toHaveLength(1);
    render(<ToggleTest x={true} />);
    expect(sheet.rules).toHaveLength(1);
  });
});

test("it accepts a ref", () => {
  const Test = styled.div({ color: "blue" });
  let ref: MutableRefObject<null | HTMLDivElement> = { current: null };
  const RenderTest = () => {
    ref = useRef(null);
    return (
      <Test ref={ref} data-testid="my-element">
        Something
      </Test>
    );
  };
  render(<RenderTest />);
  const el = screen.getByTestId("my-element");
  expect(el.textContent).toEqual("Something");
  expect(ref.current).toEqual(el);
});
