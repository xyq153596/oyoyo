const Service = require('../index')

test('init:test', () => {})

const service = new Service({
  plugins: [
    ['../../plugins/plugin-webpack-css/', { a: 1 }],
    '../../plugins/plugin-webpack-less/'
  ]
})
service.run()
