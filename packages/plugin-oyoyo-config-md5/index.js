const path = require('path')
const md5 = require('blueimp-md5')
const fs = require('fs-extra')
module.exports = (cli, pluginConfig) => {
  const newOyoyoConfigMd5 = md5(
    fs
      .readFileSync(path.resolve(cli.context, './oyoyo.config.js'), 'utf-8')
      .replace(/\s/g, '')
  )

  function isConfigMd5PathExists() {
    return fs.pathExistsSync(path.resolve(cli.context, './oyoyo.config.md5.js'))
  }

  cli.hook('generator', () => {
    cli.generator.registerGenerator('gen-oyoyo-create-config-md5', {
      use: path.resolve(__dirname, './template')
    })
  })
  cli.hook('command', () => {
    cli.command.registerCommand(
      'cmd-oyoyo-config-md5-isChange',
      async result => {
        if (isConfigMd5PathExists()) {
          const oldOyoyoConfigMd5 = require(path.resolve(
            cli.context,
            './oyoyo.config.md5.js'
          )).md5
          if (newOyoyoConfigMd5 !== oldOyoyoConfigMd5) {
            const result = await cli.command.run(
              'cmd-oyoyo-config-md5-isRunGenerator'
            )
            return result
          }
        } else {
          cli.generator.run('gen-oyoyo-create-config-md5', {
            md5: newOyoyoConfigMd5
          })
          return true
        }
        return false
      }
    )
    cli.command.registerCommand(
      'cmd-oyoyo-config-md5-isRunGenerator',
      {
        prompt: {
          type: 'confirm',
          name: 'value',
          message: '检测到配置文件已发生变化，是否重新执行预生成器？'
        }
      },
      result => {
        cli.generator.run('gen-oyoyo-create-config-md5', {
          md5: newOyoyoConfigMd5
        })
        return result.value
      }
    )
  })
}
