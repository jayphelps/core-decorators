module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  parser: "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "camelcase": "warn",
    "no-unreachable": "warn",
    "no-unused-vars": "warn",
    "no-throw-literal": "warn",
    "no-unused-expressions": "warn",
    "no-console": "off",
    "indent": ["error", 2],
    "semi": ["error", "always"],
    "space-before-function-paren": ["error", "never"]

  }
};
