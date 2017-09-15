import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Accounts',
      icon: 'ti-bar-chart-alt',
      path: '/accounts'
    },
    {
      name: 'Reply',
      icon: 'ti-pulse',
      path: '/reply'
    },
    {
      name: 'BannedUsers',
      icon: 'ti-na',
      path: '/banned-users'
    },
    {
      name: 'Messages',
      icon: 'ti-email',
      path: '/messages'
    },
    {
      name: 'DeletedReply',
      icon: 'ti-unlink',
      path: '/deleted-reply'
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
