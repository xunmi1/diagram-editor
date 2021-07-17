const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2021,
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': [PROD ? 'error' : 'warn', { allow: ['warn', 'error'] }],
    'no-debugger': PROD ? 'error' : 'warn',

    'vue/max-attributes-per-line': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
    'vue/eqeqeq': ['error', 'always', { null: 'ignore' }],
    'vue/dot-notation': 'error',

    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-return-assign': ['error', 'except-parens'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-implicit-coercion': ['error', { allow: ['!!'] }],
    'no-nested-ternary': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': 'off',
    'func-names': 'off',

    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/export': 'off',

    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],

    'vue/no-v-html': 'off',
    'vue/no-mutating-props': 'off',
  },
};
