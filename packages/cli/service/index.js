const path = require('path')
const Hookable = require('./hookable')
const CliModule = require('./cliModule')
const Generator = require('../generator')
const Command = require('../command')

const {
  transformPluginConfig,
  isLocalPlugin,
  isCustomPlugin,
  resolveCustomPlugin,
  resolveLocalPlugin,
  existFile,
  warn,
  error,
  info,
  done
} = require('../utils')
class Service extends Hookable {
  constructor(context, plugins = []) {
    super()
    this.context = context || process.cwd()
    this.plugins = []
    this.module = new CliModule()
    this.generator = new Generator(this)
    this.command = new Command()
    this.utils = {
      existFile,
      logger: { warn, error, info, done }
    }
    this.loadPlugins(plugins)
  }

  async run() {
    this.runPluginsFn()
    await this.callHook('module:init')
    await this.callHook('module:config')
    await this.callHook('module:done')
    await this.callHook('generator')
    await this.callHook('command')
  }

  loadPlugins(plugins = []) {
    if (Array.isArray(plugins) && plugins.length > 0) {
      this.plugins = plugins.map(plugin => {
        const pluginConfig = transformPluginConfig(plugin)
        let pluginPath = ''
        if (isLocalPlugin(pluginConfig.use)) {
          pluginPath = resolveLocalPlugin(pluginConfig.use)
        } else if (isCustomPlugin(pluginConfig.use)) {
          pluginPath = resolveCustomPlugin(pluginConfig.use)
        } else {
          pluginPath = path.isAbsolute(pluginConfig.use)
            ? pluginConfig.use
            : path.resolve(this.context, pluginConfig.use)
        }

        return {
          name: pluginConfig.use,
          fn: require(pluginPath),
          config: pluginConfig.config
        }
      })
    }
  }

  runPluginsFn() {
    this.plugins.forEach(plugin => {
      plugin.fn(this, plugin.config)
    })
  }
}

module.exports = Service
