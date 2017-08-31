<template>
  <div class="card login-card">
    <div class="header">
      <h4 class="title">Admin Login</h4>
    </div>
    <input placeholder="username"
           class="input"
           id="username"
           type="text"
           label="Username"
           v-model="user.username" />
    <input placeholder="code"
           class="input"
           type="password"
           label="Password"
           v-model="user.password" />
    <button id="btn" type="submit" @click.prevent="verifyId">登录</button>
  </div>
</template>
<script>
  import request from 'superagent'
  export default {
    data () {
      return {
        user: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      verifyId () {
        console.log('verify user method start', this.user)
        if (!this.user) {
          console.error('No data input')
          return null
        }
        request
          .get('/api/jwt')
          .query(this.user)
          .end((err, res) => {
            // Redirect to dashboard if succeeded
            if (err) {
              console.error(err)
            }
            console.log(res)
            if (res.ok) {
              console.log(res.body)
              this.$router.push('/')
            }
          })
      }
    }
  }
</script>
<style>
  .login-card {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    text-align: center;
    width: 300px;
  }
  .input {
    display: block;
    outline: none;
    padding: 2px;
    margin: 0 auto;
    width: 250px;
    margin-top: 20px;
  }

  #btn {
    margin-top: 20px;
  }
</style>
