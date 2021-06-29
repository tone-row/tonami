describe("stylesheet", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should parse styles if styles already in head", () => {
    expect(document.head.innerHTML).toEqual("");
    document.head.innerHTML = `<style id="tonami" data-testid="tonami">/* ~~~t1~~~ */
.ta0.ta1 { color: red; }
/* ~~~t2~~~ */
.ta2.ta3 { color: orange; }</style>`;
    const { mainSheet } = require("../sheet");
    expect(mainSheet.styles).toEqual({
      t1: ".ta0.ta1 { color: red; }",
      t2: ".ta2.ta3 { color: orange; }",
    });
  });
});
