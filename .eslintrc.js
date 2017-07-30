module.exports = {
    extends: "semistandard",
    parser: "babel-eslint",
    env: {
        mocha: true
    },
    rules: {
        "camelcase": "warn",
        "no-unreachable": "warn",
        "no-unused-vars": "warn",
        "no-throw-literal": "warn",
        "no-unused-expressions": "warn"
    }
};