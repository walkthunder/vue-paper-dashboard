import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Login',
      icon: 'ti-user',
      path: '/login'
    },
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
      name: 'Account',
      icon: 'ti-pin',
      path: '/account'
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
    },
    {
      name: 'Dashboard',
      icon: 'ti-panel',
      path: '/overview'
    },
    {
      name: 'Table List',
      icon: 'ti-view-list-alt',
      path: '/table-list'
    },
    {
      name: 'Typography',
      icon: 'ti-text',
      path: '/typography'
    },
    {
      name: 'Icons',
      icon: 'ti-pencil-alt2',
      path: '/icons'
    },
    {
      name: 'Notifications',
      icon: 'ti-bell',
      path: '/notifications'
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
