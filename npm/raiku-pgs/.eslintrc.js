module.exports = {
  extends: require.resolve("../../.eslintrc.js"),
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "tsconfig.json",
    extraFileExtensions: [".vue"]
  }
}
