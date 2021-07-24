module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "src",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
