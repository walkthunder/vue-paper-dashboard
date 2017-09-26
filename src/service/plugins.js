import cache from './cache'
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // Add user property
  Vue.user = {}
  // get user
  Vue.prototype.$getUser = function () {
    console.log('getUser info: ', Vue.user)
    return cache.getItem('user')
  }
  // update user
  Vue.prototype.$updateUser = function (userInfo) {
    console.log('set user info: ', userInfo)
    cache.setItem('user', userInfo)
  }
  Vue.prototype.$removeUser = function () {
    cache.removeItem('user')
  }
}
export default MyPlugin
