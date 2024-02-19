/** @type {import("eslint").Linter.Config} */
const config = {
    ignorePatterns: ["src/components/ui/**/*.tsx"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    rules: {
        // These opinionated rules are enabled in stylistic-type-checked above.
        // Feel free to reconfigure them to your own preference.
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/consistent-type-definitions": "off",

        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            },
        ],
        "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {attributes: false},
            },
        ],
    },
};

module.exports = config;
