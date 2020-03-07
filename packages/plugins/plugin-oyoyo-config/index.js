const path = require('path')
module.exports = (cli, pluginConfig) => {
  cli.hook('generator', () => {
    cli.generator.registerGenerator('gen-oyoyo-create-config', {
      use: path.resolve(__dirname, './template')
    })
  })
  cli.hook('command', () => {
    cli.command.registerCommand(
      'cmd-oyoyo-create-config',
      {
        prompt: {
          type: 'confirm',
          name: 'value',
          message: '是否创建配置文件？'
        }
      },
      result => {
        if (result.value) {
          cli.generator.run('gen-oyoyo-create-config')
        }
      }
    )
  })
}
