module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Uses `eslint-config-prettier` to disable ESLint rules from `@typescript-eslint/eslint-plugin`
    'prettier',
    // Must always be last
    'plugin:prettier/recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    // 每一个函数都要显式的表明函数返回值
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    'vue/no-mutating-props': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
};
