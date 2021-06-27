import React from "react";
import { render, waitFor } from "@testing-library/react";
import { getUniqueId } from "../getUniqueId";
import { useStyle } from "../style";

describe("useStyle", () => {
  const uid = getUniqueId();
  it("should write styles to head", async () => {
    const Test = () => {
      useStyle(uid, "body { color: orange; }");
      return <div>This is some text</div>;
    };
    const {} = render(<Test />);
    await waitFor(() =>
      expect(
        window.getComputedStyle(document.body).getPropertyValue("color")
      ).toEqual("orange")
    );
  });
});
