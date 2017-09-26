import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: '马甲管理',
      icon: 'ti-bar-chart-alt',
      path: 'accounts'
    },
    {
      name: '用户评论',
      icon: 'ti-pulse',
      path: 'reply'
    },
    {
      name: '封禁用户',
      icon: 'ti-na',
      path: 'banned-users'
    },
    {
      name: '我的消息',
      icon: 'ti-email',
      path: 'messages'
    },
    {
      name: '已删除回复',
      icon: 'ti-unlink',
      path: 'deleted-reply'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
