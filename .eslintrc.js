module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "mocha"],
  extends: ["airbnb-base", "airbnb-typescript/base"],
  globals: {
    describe: true,
    it: true,
    before: true,
    after: true,
    beforeEach: true,
    afterEach: true,
  },
  rules: {
    "import/no-extraneous-dependencies": 0,
    "react/jsx-filename-extension": 0,
    "import/extensions": 0,
    "@typescript-eslint/indent": [2, 4],
  },
};
