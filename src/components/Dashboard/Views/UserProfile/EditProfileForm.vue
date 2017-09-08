<template>
  <div class="card">
    <div class="header">
      <h4 class="title">用户信息</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="性别"
                      placeholder="unknown"
                      v-model="this.gender">
            </fg-input>
          </div>
          <div class="col-md-4">

            <fg-input type="text"
                      label="生日"
                      placeholder="unknown"
                      v-model="this.birthday">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="地区"
                      placeholder="unknown"
                      v-model="this.area">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="年龄"
                      placeholder="unknown"
                      v-model="this.age">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="被封禁"
                      placeholder="unknown"
                      v-model="this.is_blocked">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="电话"
                      placeholder="unknown"
                      v-model="this.phone_number">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="用户ID"
                      placeholder="unknown"
                      v-model="this.userid">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="微博"
                      placeholder="unknown"
                      v-model="this.weiboname">
            </fg-input>
          </div>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    props: [ 'username', 'userid', 'gender', 'birthday', 'area', 'age', 'is_blocked', 'phone_number', 'weiboname' ],
    data () {
      return {
        user: {
          company: 'Paper Dashboard',
          username: 'michael23',
          email: '',
          lastName: 'Faker',
          address: 'Melbourne, Australia',
          city: 'melbourne',
          postalCode: '',
          aboutMe: `Oh so, your weak rhyme. You doubt I'll bother, reading into it.I'll probably won't, left to my own devicesBut that's the difference in our opinions.`
        }
      }
    },
    methods: {
      updateProfile () {
        alert('Your data: ' + JSON.stringify(this.user))
      }
    }
  }

</script>
<style>

</style>
