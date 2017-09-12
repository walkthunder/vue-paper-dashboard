const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // Add user property
  Vue.user = {}
  // get user
  Vue.prototype.$getUser = function () {
    console.log('getUser info: ', Vue.user)
    return Vue.user
  }
  // update user
  Vue.prototype.$updateUser = function (userInfo) {
    console.log('set user info: ', userInfo)
    Vue.user = userInfo
  }
}
export default MyPlugin
