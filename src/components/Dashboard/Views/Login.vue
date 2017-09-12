<template>
  <div class="login">
    <img class="background" src="//pic.qingting.fm/goods/2016/12/11/f6839dd1fb23e4878d823660fcbd42de.jpg" alt="">
    <el-card label-position="left" class="box-card" id="login-card">
      <div slot="header">
        用户评论管理系统
      </div>
      <el-form :model="user" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" @keyup.enter.native="onSubmit" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="text-align:center" id="btn">
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import api from '../../../service/data/login'
  import cache from '../../../service/cache'
  export default {
    data () {
      return {
        user: {
          username: '',
          password: ''
        }
      }
    },
    created () {
      if (cache.getItem('token')) {
        console.log('token existed')
      }
    },
    methods: {
      onSubmit () {
        if (!this.user.username) {
          this.$message.error('用户名未填写')
          return
        }
        if (!this.user.password) {
          this.$message.error('密码未填写')
          return
        }
        if (!this.user) {
          console.error('No data input')
          return null
        }
        api('login').fetch({ username: this.user.username, password: this.user.password })
          .then((res) => {
            // Redirect to dashboard if succeeded
            console.log(res)
            if (res && res.data) {
              cache.setItem('token', res.data.toString())
              this.$updateUser({ id: res.data })
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              this.$router.push(`${this.$localStorage.get('afterLogin') || '/'}`)
              this.$localStorage.remove('afterLogin')
            }
          })
          .catch(err => {
            console.error(err)
            this.$message.error(err)
          })
      }
    }
  }
</script>
<style>
  .login {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .background {
    position: fixed;
    left: 0;
    top: 0px;
    right: 0;
    z-index: -1;
  }
  #btn > div {
    margin-left: 0 !important;
  }
  #login-card {
    width: 400px;
    margin: 80px auto;
    padding: 0px 10px;
  }
</style>
