const path = require('path')
module.exports = {
  plugins: [
    [
      '@web/plugin-webpack',
      {
        configureWebpack: {
          output: {
            path: path.resolve(__dirname, 'dist')
          },
          entry: { index: ['./index.ts'] }
        }
      }
    ],
    '@web/plugin-webpack-ts',
    '@web/plugin-webpack-babel',
    ['@web/plugin-jest'],
    [
      '@web/plugin-webpack-select-env',
      [
        {
          name: 'dev',
          value: 'dev'
        }
      ]
    ]
  ]
}
