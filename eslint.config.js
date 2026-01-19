import stylisticTs from '@stylistic/eslint-plugin-ts';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		// Игнорируемые пути
		ignores: ['**/node_modules/**', '**/dist/**', 'build/**', '.git/**', '**/*.config.js'],
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			react: reactPlugin,
			'@stylistic/ts': stylisticTs,
		},
		rules: {
			// Базовые правила
			'max-len': [
				'error',
				{
					code: 120,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignoreComments: true,
				},
			],
			'object-curly-spacing': ['error', 'always'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],

			// Правила для пробелов и пустых строк
			'no-trailing-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
			'eol-last': ['error', 'always'],
			'no-empty': ['error', { allowEmptyCatch: true }],
			'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],

			// Правила для переносов строк
			'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],

			// React правила
			'react/jsx-indent': ['error', 2],
			'react/jsx-indent-props': ['error', 2],
			'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
			'react/jsx-first-prop-new-line': ['error', 'multiline'],
			'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
			'react/jsx-wrap-multilines': [
				'error',
				{
					declaration: 'parens-new-line',
					assignment: 'parens-new-line',
					return: 'parens-new-line',
					arrow: 'parens-new-line',
					condition: 'parens-new-line',
					logical: 'parens-new-line',
					prop: 'ignore',
				},
			],

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// React Refresh
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	},
);
