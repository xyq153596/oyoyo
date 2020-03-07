const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const Conf = require('conf')

const pluginRE = /^@oyoyo\/plugin-\w+/
const officialRE = /^@oyoyo\//

const oyoyoDbPath = path.join(os.homedir(), '.oyoyo')
const oyoyoDb = new Conf({
  cwd: oyoyoDbPath,
  configName: 'data',
  defaults: {
    customPluginDir: {}
  }
})

exports.transformPluginConfig = pluginConfig => {
  if (Array.isArray(pluginConfig)) {
    return { use: pluginConfig[0], config: pluginConfig[1] }
  } else if (typeof pluginConfig === 'string') {
    return { use: pluginConfig }
  } else {
    return {
      use: pluginConfig.use,
      config: pluginConfig.config
    }
  }
}

exports.resolveLocalPlugin = name => {
  return path.resolve(__dirname, '../../', name.replace(officialRE, ''))
}

exports.resolveCustomPlugin = name => {
  const dir = name.split('/')[0]
  return path.join(
    oyoyoDb.store.customPluginDir[dir],
    './' + name.replace(dir, '')
  )
}

exports.isLocalPlugin = name => {
  return pluginRE.test(name)
}

exports.isCustomPlugin = name => {
  if (name.charAt(0) === '@') {
    const dir = name.split('/')[0]
    return oyoyoDb.store.customPluginDir[dir] !== undefined
  } else {
    return false
  }
}

exports.existFile = (filePath, context) => {
  if (path.isAbsolute(filePath) && context === undefined) {
    return fs.pathExistsSync(filePath)
  } else {
    return fs.pathExistsSync(path.resolve(context, filePath))
  }
}
