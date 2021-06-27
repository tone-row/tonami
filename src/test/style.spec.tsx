import React from "react";
import { render, waitFor } from "@testing-library/react";
import { getUniqueId } from "../lib/getUniqueId";
import { useStyle } from "../style";

describe("useStyle", () => {
  const uid = getUniqueId();
  it("should write styles to head", async () => {
    const Test = () => {
      useStyle(uid, "body { color: yellow; }");
      return <div>This is some text</div>;
    };
    render(<Test />);
    await waitFor(() =>
      expect(
        window.getComputedStyle(document.body).getPropertyValue("color")
      ).toEqual("yellow")
    );
  });

  it("should update style if style changes and reuse id", async () => {
    const uid = getUniqueId();
    const Test = ({ color }: { color: string }) => {
      useStyle(uid, `body { color: ${color}; }`);
      return <div>This is some text</div>;
    };
    const { rerender } = render(<Test color="orange" />);
    await waitFor(() =>
      expect(
        window.getComputedStyle(document.body).getPropertyValue("color")
      ).toEqual("orange")
    );
    rerender(<Test color="blue" />);
    await waitFor(() => {
      const style = document.querySelector("style")?.innerHTML;
      expect(style).toContain("blue");
      expect(style).not.toContain("orange");
    });
  });
});
