const { greet } = require("../src/index");

describe("greet", () => {
  test("returns greeting with name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  test("returns greeting with different name", () => {
    expect(greet("Claude")).toBe("Hello, Claude!");
  });
});
