import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import create from "../create";
import { ServerStylesheet } from "../server";

describe("ServerStylesheet", () => {
  it("should have styles when render to string is run", () => {
    const TestComponent = create.div({ color: "blue" });
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
