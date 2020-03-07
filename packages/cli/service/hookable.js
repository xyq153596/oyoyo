module.exports = class Hookable {
  constructor() {
    this._hooks = {}
    this._deprecatedHooks = {}

    this.hook = this.hook.bind(this)
    this.callHook = this.callHook.bind(this)
  }

  hook(name, fn) {
    if (!name || typeof fn !== 'function') {
      return
    }

    if (this._deprecatedHooks[name]) {
      console.warn(
        `${name} hook has been deprecated, please use ${this._deprecatedHooks[name]}`
      )
      name = this._deprecatedHooks[name]
    }

    this._hooks[name] = this._hooks[name] || []
    this._hooks[name].push(fn)
  }

  async callHook(name, ...args) {
    if (!this._hooks[name]) {
      return
    }
    // console.debug(`Call ${name} hooks (${this._hooks[name].length})`)
    try {
      await sequence(this._hooks[name], fn => fn(...args))
    } catch (err) {
      name !== 'error' && this.callHook('error', err)
      console.error(err)
    }
  }

  clearHook(name) {
    if (name) {
      delete this._hooks[name]
    }
  }

  clearHooks() {
    this._hooks = {}
  }

  flatHooks(configHooks, hooks = {}, parentName) {
    Object.keys(configHooks).forEach(key => {
      const subHook = configHooks[key]
      const name = parentName ? `${parentName}:${key}` : key
      if (typeof subHook === 'object' && subHook !== null) {
        this.flatHooks(subHook, hooks, name)
      } else {
        hooks[name] = subHook
      }
    })
    return hooks
  }

  addHooks(configHooks) {
    const hooks = this.flatHooks(configHooks)
    Object.keys(hooks)
      .filter(Boolean)
      .forEach(key => {
        ;[].concat(hooks[key]).forEach(h => this.hook(key, h))
      })
  }
}

function sequence(tasks, fn) {
  return tasks.reduce(
    (promise, task) => promise.then(() => fn(task)),
    Promise.resolve()
  )
}
