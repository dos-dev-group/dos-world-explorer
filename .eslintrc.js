module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    //
    'no-plusplus': 'off',
    'prefer-template': 'off',
    'object-shorthand': 'off',
    'no-console': 'off',
    'prefer-destructuring': 'off',
    'no-continue': 'off',
    'spaced-comment': 'off',
    'no-unneeded-ternary': 'off',
    'no-bitwise': 'off',
    'default-case': 'off',
    'no-restricted-syntax': [
      'off',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'import/prefer-default-export': 'off',
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/self-closing-comp': 'off',
    'react/require-default-props': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-boolean-value': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  env: {
    'jest/globals': true,
  },
};
