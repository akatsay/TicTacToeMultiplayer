module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Add the "node" environment
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['warn', 2],
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
