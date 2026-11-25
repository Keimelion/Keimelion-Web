import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const HEX_COLOR_PATTERN = '/#[0-9a-fA-F]{3,8}\\b/'
const HEX_COLOR_MESSAGE = 'Use a design token from src/styles/tokens.css instead of a hex colour.'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: `Literal[value=${HEX_COLOR_PATTERN}]`, message: HEX_COLOR_MESSAGE },
        { selector: `TemplateElement[value.raw=${HEX_COLOR_PATTERN}]`, message: HEX_COLOR_MESSAGE },
      ],
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    files: ['src/components/ui/**'],
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
)
