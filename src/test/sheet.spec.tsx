describe("stylesheet", () => {
  it("should parse styles if styles already in head", () => {
    expect(document.head.innerHTML).toEqual("");
    document.head.innerHTML = `<style id="tonami" data-testid="tonami">/* ~~~t1~~~ */\n.ta0.ta1 { color: blue; }</style>`;
    const { mainSheet } = require("../sheet");
    expect(mainSheet.styles).toEqual({
      t1: ".ta0.ta1 { color: blue; }",
    });
  });
});
