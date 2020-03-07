module.exports = class moduleAPI {
  constructor() {
    this.modules = {}
  }

  registerModule(name, obj) {
    this.modules[name] = obj
  }

  getModule(name) {
    return this.modules[name]
  }

  hasModule(name) {
    return this.modules[name] !== undefined
  }
}
