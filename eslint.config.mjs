import js from '@eslint/js';
import ts from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default defineConfig([
    globalIgnores([
        "node_modules/",
        "main.js"
    ]),
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            }
        }
    },
    js.configs.recommended,
    ts.configs.recommended,
    ...obsidianmd.configs.recommended,
    {
        rules: {
            // Disable base rules in favor of TypeScript versions
            "no-unused-vars": "off",
            "no-case-declarations": "error",
            "no-prototype-builtins": "off",

            // TypeScript ESLint rules
            "@typescript-eslint/no-unused-vars": [
                "error", {
                    args: "none",
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/require-await": "error",
        },
    },
    {
        files: ["src/**/*.ts"],
        ignores: ['src/**/*.svelte.ts'],
        languageOptions: {
            parser: ts.parser,
            parserOptions: { project: "./tsconfig.json" },
        },
        rules: {
            // Obsidian plugin rules (ensure command rules are enabled)
            "obsidianmd/commands/no-plugin-id-in-command-id": "error",
            "obsidianmd/commands/no-plugin-name-in-command-name": "error",

        }
    },
]);
