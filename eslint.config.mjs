import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
}, ...compat.extends("next/core-web-vitals", "next/typescript"), {
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-expressions": "off"
    },
}];