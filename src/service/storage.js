let localStorageValid = false
if (window.localStorage !== undefined) {
  let key = 'test'
  try {
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    localStorageValid = true
  } catch (error) {
    localStorageValid = false
  }
}

function getItem (key) {
  if (!localStorageValid) {
    return
  }
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

function setItem (key, value) {
  if (!localStorageValid) {
    return
  }
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    return null
  }
}

module.exports = {
  getItem,
  setItem
}
