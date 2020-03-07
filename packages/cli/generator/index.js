const glob = require('fast-glob')
const handlebars = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
module.exports = class Generator {
  constructor(service) {
    this.generators = {}
    this.service = service
  }

  registerGenerator(name, config = {}) {
    const genConfig = Object.assign(
      {
        use: '',
        type: 'cover',
        data: {},
        pkg: {},
        immediate: false
      },
      config
    )
    this.generators[name] = genConfig
  }

  async run(name, otherData = {}) {
    if (!this.hasGenerator(name)) throw new Error('没有generator')
    const generator = this.generators[name]
    const files = glob.sync('**', {
      cwd: generator.use,
      dot: true
    })
    const genData = Object.assign(generator.data, otherData)
    files.forEach(filePath => {
      const compileResult = handlebars.compile(
        fs.readFileSync(path.resolve(generator.use, filePath), 'utf-8'),
        {
          noEscape: true
        }
      )(genData)
      const pathResult = handlebars.compile(filePath)(genData)
      fs.outputFileSync(
        path.resolve(this.service.context, pathResult),
        compileResult
      )
    })
  }

  hasGenerator(name) {
    return this.generators[name] !== undefined
  }
}
