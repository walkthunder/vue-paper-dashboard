<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <el-popover
        ref="popoverManager"
        placement="top"
        width="220"
        v-model="showManager">
        <p class="info-header">管理员信息</p>
        <p><span class="info-key">ID:</span><span class="info-val">{{this.userId}}</span></p>
        <p><span class="info-key">NAME:</span><span class="info-val">{{this.userName}}</span></p>
        <div style="text-align: center; margin: 0">
          <el-button type="primary" size="small" @click="logout">注销</el-button>
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
              <el-button class="el-icon-setting" type="text" v-popover:popoverManager @click="clicker">管理员</el-button>
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
        const titleMap = {
          login: '登录',
          reply: '用户评论列表',
          accounts: '马甲列表',
          account: '用户信息',
          'banned-users': '被封禁用户列表',
          messages: '管理员消息列表',
          'deleted-reply': '已删除评论'
        }
        const {name} = this.$route
        return titleMap[name] || this.capitalizeFirstLetter(name)
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
        this.showManager = false
        this.$removeUser()
        cache.removeItem('token')
        this.$router.push({ name: 'login' })
        this.$message.success('注销成功')
      },
      clicker () {
        this.refreshInfo()
      }
    }
  }

</script>
<style>
  .info-header {
    display: block;
    font-size: large;
    padding: 5px 0 10px;
    border-bottom: 1px solid grey;
  }
  .info-key {
    display: inline-block;
    width: 60px;
  }
  .info-val {
    display: inline-block;
  }
</style>
