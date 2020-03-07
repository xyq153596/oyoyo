#!/usr/bin/env node

const Service = require('../service')
const path = require('path')
const fs = require('fs-extra')

const { info, done } = require('../utils')

const cwd = process.cwd()
const service = new Service()

const oyoyoConfigPath = path.resolve(cwd, './oyoyo.config.js')
const isConfigExist = fs.pathExistsSync(oyoyoConfigPath)

if (isConfigExist) {
  const oyoyoConfig = require(oyoyoConfigPath)
  service.loadPlugins(
    [
      '@oyoyo/plugin-oyoyo-config',
      '@oyoyo/plugin-oyoyo-register-newplugindir',
      '@oyoyo/plugin-oyoyo-config-md5'
    ].concat(oyoyoConfig.plugins)
  )
} else {
  service.loadPlugins([
    '@oyoyo/plugin-oyoyo-config',
    '@oyoyo/plugin-oyoyo-register-newplugindir'
  ])
}

async function run() {
  await service.run()
  const immediateGenerators = Object.keys(service.generator.generators).filter(
    name => {
      return service.generator.generators[name].immediate
    }
  )
  initMenuCommands()
  if (immediateGenerators.length > 0) {
    if (await service.command.run('cmd-oyoyo-config-md5-isChange')) {
      await runImmediateGenerator(immediateGenerators)
    }
  }
  service.command.run('cmd-oyoyo-menu')
}

run()

async function runImmediateGenerator(immediateGenerators) {
  if (immediateGenerators.length > 0) {
    for (let i = 0; i < immediateGenerators.length; i++) {
      info(`执行 ${immediateGenerators[i]}`)
      await service.generator.run(immediateGenerators[i])
    }
    done('预生成器执行完毕')
  }
}

function initMenuCommands() {
  const menuCommands = Object.keys(service.command.commands)
    .filter(name => {
      return service.command.commands[name].config.isMenu
    })
    .map(name => {
      return {
        name: service.command.commands[name].config.alias,
        value: name
      }
    })

  service.command.registerCommand(
    'cmd-oyoyo-menu',
    {
      isMenu: true,
      prompt: {
        type: 'rawlist',
        name: 'value',
        message: '请选择一个命名执行',
        choices: menuCommands.concat([
          {
            name: 'initOyoyoConfig 初始化一个oyoyo配置文件',
            value: 'cmd-oyoyo-create-config'
          },
          {
            name: 'regisiterNewPluginDir 注册一个新的插件目录',
            value: 'cmd-oyoyo-regisiter-new-plugin-dir'
          },
          {
            name: 'viewPluginDir 查看已注册的插件目录',
            value: 'cmd-oyoyo-view-new-plugin-dir'
          }
        ])
      }
    },
    async result => {
      service.command.run(result.value)
    }
  )
}
