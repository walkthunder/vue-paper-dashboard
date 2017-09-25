<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <!--This sidebar appears only for screens smaller than 992px-->
    <side-bar type="navbar" :sidebar-links="$sidebar.sidebarLinks">
      <ul class="nav navbar-nav">
        <li>
          <a @click="logout">
            <i class="ti-settings"></i>
            <p>Logout</p>
          </a>
        </li>
        <li class="divider"></li>
      </ul>
    </side-bar>
  </div>
</template>

<script>
  import cache from './service/cache'
  export default {
    methods: {
      logout () {
        console.log('logout')
        this.$removeUser()
        cache.removeItem('token')
        this.$router.push({ name: 'login' })
        this.$message.success('注销成功')
      }
    }
  }
</script>

<style lang="scss">
  @import './main.css';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width: 1000px;
  }
  html {
    min-width: 1000px;
  }
</style>
