const path = require('path')
const os = require('os')

const Conf = require('conf')

const oyoyoDbPath = path.join(os.homedir(), '.oyoyo')
const oyoyoDb = new Conf({
  cwd: oyoyoDbPath,
  configName: 'data'
})

module.exports = (cli, options) => {
  cli.command.registerCommand(
    'cmd-oyoyo-regisiter-new-plugin-dir',
    async result => {
      const name = await cli.command.run(
        'cmd-oyoyo-regisiter-new-plugin-dir-newDirName'
      )
      const path = await cli.command.run(
        'cmd-oyoyo-regisiter-new-plugin-dir-newDirPath'
      )

      oyoyoDb.set(`customPluginDir.${name}`, path)
    }
  )
  cli.command.registerCommand('cmd-oyoyo-view-new-plugin-dir', async result => {
    console.log(oyoyoDb.store.customPluginDir)
  })
  cli.command.registerCommand(
    'cmd-oyoyo-regisiter-new-plugin-dir-newDirName',
    {
      prompt: {
        type: 'input',
        name: 'value',
        message: '请输入目录名，请以@开头'
      }
    },
    async result => {
      return result.value
    }
  )
  cli.command.registerCommand(
    'cmd-oyoyo-regisiter-new-plugin-dir-newDirPath',
    {
      prompt: {
        type: 'input',
        name: 'value',
        message: '请输入目录地址'
      }
    },
    async result => {
      return result.value
    }
  )
}
