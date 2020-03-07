module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  // required to lint *.vue files
  plugins: [],
  // add your custom rules here
  rules: {
    // 'no-var': "error",
  }
}
