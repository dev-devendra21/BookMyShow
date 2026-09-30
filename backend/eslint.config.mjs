// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
        parserOptions: {
            tsconfigRootDir,
        },
    },
    ignores: ['dist/**/*', 'node_modules/**/*', 'eslint.config.mjs'],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
    },
});
