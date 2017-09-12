<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-5">
        <user-card :name="this.username" :id="this.userid" :description="this.description" :avatar="this.avatar">

        </user-card>
      </div>
      <div class="col-lg-8 col-md-7">
        <edit-profile-form
          :userid="this.userid"
          :birthday="this.birthday"
          :gender="this.gender"
          :area="this.area"
          :age="this.age"
          :phone_number="this.phone_number"
          :weiboname="this.weiboname"
          :is_blocked="this.is_blocked">

        </edit-profile-form>
      </div>
    </div>
    <div class="row" id="submodule">
      <user-log :userId="this.userid">
      </user-log>
    </div>
  </div>
</template>
<script>
  import EditProfileForm from './UserProfile/EditProfileForm.vue'
  import UserCard from './UserProfile/UserCard.vue'
  import UserLog from './UserProfile/UserLog.vue'
  import api from '../../../service/data/account'
  export default {
    components: {
      EditProfileForm,
      UserCard,
      UserLog
    },
    mounted () {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    watch: {
      '$route': 'fetchData'
    },
    data () {
      return {
        userid: this.$route.params.user_id || 'da4b9295b661ded7f127b71c5b8da1c6', // Mock data
        username: '',
        description: '',
        avatar: '',
        official: false,
        gender: '',
        birthday: '',
        area: '',
        age: '',
        is_blocked: '',
        phone_number: '',
        weiboname: '',
        owners: []
      }
    },
    methods: {
      fetchData () {
        let tags = { 's_T_A_T_I_C': this.userid }
        api('account').fetch(tags)
          .then(account => {
            console.log('account data: ', account.data)
            let accountData = account.data
            this.username = accountData.username
            this.userid = accountData.userid
            this.description = accountData.description || 'No description'
            this.avatar = accountData.avatar // TODO: Default avatar url
            this.gender = accountData.gender
            this.birthday = accountData.birthday
            this.area = accountData.area
            this.age = accountData.age
            this.is_blocked = (!!accountData.is_blocked).toString()
            this.phone_number = accountData.phone_number
            this.weiboname = accountData.weiboname
          })
      }
    }
  }

</script>
<style>
  #submodule {
    margin: 0;
  }
</style>
