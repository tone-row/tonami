/**
 * @jest-environment node
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { styled } from "../styled";
import { ServerStylesheet } from "../server";

describe("ServerStylesheet", () => {
  it("should have styles when render to string is run", () => {
    const TestComponent = styled.div({ color: "blue" });
    const Test = () => {
      return (
        <div>
          <TestComponent />
          <ServerStylesheet />
        </div>
      );
    };
    const html = renderToStaticMarkup(<Test />);
    expect(html).toContain("color: blue;");
  });
});
