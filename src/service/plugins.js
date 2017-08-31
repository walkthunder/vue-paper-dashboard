const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // get user
  Vue.prototype.$getUser = function () {
    return this.$root.$children[0].userInfo
  }
  // update user
  Vue.prototype.$updateUser = function (userInfo) {
    this.$root.$children[0].userInfo = userInfo
  }
  // get user admin
  Vue.prototype.$getManager = function () {
    var userInfo = this.$getUser()
    return ['admin', 'chief-editor', 'manager'].indexOf(userInfo.role) > -1
  }
}
export default MyPlugin
