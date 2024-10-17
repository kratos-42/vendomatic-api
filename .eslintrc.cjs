module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@stylistic',
    '@stylistic/ts',
    'import',
    'sort-destructure-keys',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'docs/',
    '.eslintrc.js',
  ],
  overrides: [
    { 
      files: ["test/**"],
      extends: [
        'plugin:jest/recommended',
      ]
    }
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/dot-notation": [
      "error",
      {
        "allowIndexSignaturePropertyAccess": true
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    "@stylistic/quotes": ["error", "single"],
    "@stylistic/ts/no-extra-parens": ["error"],
    "@stylistic/no-multiple-empty-lines": ["error", {
      max: 1,
      maxEOF: 1
    }],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/require-await": "error",
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'eqeqeq': ['error', 'always'],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: false },
      },
    ],
    'indent': ['error', 2, {
      ignoredNodes: ["PropertyDefinition"],
      SwitchCase: 1
    }],
    'no-console': 'error',
    'no-multi-spaces': 'error',
    'semi': 'error',
    'sort-destructure-keys/sort-destructure-keys': ['error', {
      caseSensitive: true
    }],
    'sort-keys': ['error', 'asc', {
      natural: true
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
};
