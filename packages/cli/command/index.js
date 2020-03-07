const inquirer = require('inquirer')
module.exports = class Command {
  constructor() {
    this.commands = {}
  }

  registerCommand(name, config = {}, cb) {
    if (typeof config === 'function') {
      this.commands[name] = {
        config: {},
        cb: config
      }
    } else {
      this.commands[name] = {
        config,
        cb
      }
    }
  }

  async run(name) {
    const command = this.commands[name]
    if (!this.hasCommand(name)) {
      throw new Error(`没有command:${name}`)
    }
    let result
    if (command.config.prompt !== undefined) {
      result = await inquirer.prompt([command.config.prompt])
    }
    const cbResult = await command.cb(result)
    return cbResult
  }

  hasCommand(name) {
    return this.commands[name] !== undefined
  }
}
