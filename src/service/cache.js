function Cache (options) {
  const store = window.sessionStorage

  Cache.prototype.getItem = function (key) {
    var value = store.getItem(key)
    if (value) {
      var now = new Date().getTime()
      var tmp = {}
      try {
        tmp = JSON.parse(value)
      } catch (e) {
        store.removeItem(key)
        throw new Error('JSON parse error')
      }
      var expire = tmp.expire
      if (expire !== 0 && now > expire) {
        return null
      }
      return tmp.value
    } else {
      return null
    }
  }

  Cache.prototype.setItem = function (k, v, expire = 180) {
    if (typeof k !== 'string') throw new Error('The key of storage item should be a string!')
    var now = new Date().getTime()
    var value = JSON.stringify({
      expire: now + expire * 60000,
      value: v
    })
    store.setItem(k, value)
    return this
  }

  Cache.prototype.removeType = function (type) {
    for (var i = store.length - 1; i >= 0; i--) {
      var key = store.key(i)
      if (key.search(type) > -1) {
        store.removeItem(key)
      }
    }
  }

  Cache.prototype.removeItem = function (key) {
    store.removeItem(key)
    return this
  }

  Cache.prototype.clear = function () {
    store.clear()
    return this
  }
}

const cache = new Cache()
export default cache
