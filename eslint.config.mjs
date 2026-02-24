export default [
  {
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        process: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/"],
  },
];
