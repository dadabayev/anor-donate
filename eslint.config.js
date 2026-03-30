import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPrettierConfig from 'eslint-config-prettier'
import sonarjs from 'eslint-plugin-sonarjs'
import unusedImports from 'eslint-plugin-unused-imports'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    ignores: ['steiger.config.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      sonarjs.configs.recommended,
      eslintPrettierConfig,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // TYPESCRIPT
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',

      // REACT
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.jsx', '.tsx'] },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // IMPORTS
      'import/no-default-export': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // side effect imports
            [`^\\u0000`],
            // node built-ins
            [`^node:`],
            // react & external packages
            [`'^react', '^@?\\w'`],
            // internal project paths
            [`^(entities|features|shared|widgets|pages|processes|app)(/.*|$)`],
            // parent imports
            [`'^\\.\\.(?!/?$)', '^\\.\\./?$'`],
            // sibling imports
            [`'^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)'`],
            // index imports
            [`^\\./?$`],
            // style imports
            [`^.+\\.s?css$`],
          ],
        },
      ],

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'unused-imports/no-unused-imports': 'error',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-clear-text-protocols': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
