<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <el-popover
        ref="popoverManager"
        placement="top"
        width="220"
        v-model="showManager">
        <p>Manager Info</p>
        <p>ID: {{this.userId}}</p>
        <p>NAME: {{this.userName}}</p>
        <div style="text-align: center; margin: 0">
          <el-button type="primary" size="mini" @click="logout">注销</el-button>
        </div>
      </el-popover>
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar bar1"></span>
          <span class="icon-bar bar2"></span>
          <span class="icon-bar bar3"></span>
        </button>
        <a class="navbar-brand">{{routeName}}</a>
      </div>
      <div class="navbar-right-menu">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="#" class="btn-rotate">
              <el-button class="el-icon-setting" type="text" v-popover:popoverManager>管理员</el-button>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import ElPopover from '../../../../node_modules/element-ui/packages/popover/src/main.vue'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'
  import cache from '../../../service/cache'
  export default {
    components: {
      ElButton,
      ElPopover},
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    watch: {
      '$route': 'refreshInfo'
    },
    data () {
      return {
        userId: '',
        userName: '',
        showManager: false,
        activeNotifications: false
      }
    },
    methods: {
      refreshInfo () {
        let manager = this.$getUser()
        console.log('refreshInfo', manager)
        if (manager) {
          this.userId = manager.id
          this.userName = manager.name
        }
      },
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      logout () {
        console.log('logout')
        this.$removeUser()
        cache.removeItem('token')
        this.$message.success('注销成功')
      }
    }
  }

</script>
<style>

</style>
