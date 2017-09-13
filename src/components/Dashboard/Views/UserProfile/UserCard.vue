<template>
  <div class="card card-user" id="user-info">
    <div class="image">
      <img src="/static/img/background.jpg" alt="...">
    </div>
    <div class="content">
      <div class="author">
        <img class="avatar border-white"
             :src="this.avatar || '//qingtingtest.oss-cn-hangzhou.aliyuncs.com/msg_center/%E8%9C%BB%E8%9C%93%E5%B0%8F%E7%AE%A1%E5%AE%B6%E5%A4%B4%E5%83%8F.jpeg'"
             alt="...">
        <h4 class="title">{{this.name}}
          <br>
          <a href="#">
            <small>{{this.id}}</small>
          </a>
        </h4>
      </div>
      <p class="description text-center">
       {{description}}
      </p>
    </div>
    <hr>
    <div class="text-center">
      <div class="row">
        <div v-for="(info, index) in details" :class="getClasses(index)" @click="showBan">
          <el-button type="primary" :icon="info.icon"></el-button>
          <h5>
            <small>{{info.subTitle}}</small>
          </h5>
        </div>
      </div>
    </div>
    <el-dialog title="封禁用户" :visible.sync="isBanning">
      <el-form label-width="120px">
        <el-form-item label="选择封禁原因" prop="type">
          <el-checkbox-group v-model="bannedReason">
            <el-checkbox label="无意义的回复" name="type"></el-checkbox>
            <el-checkbox label="营销广告" name="type"></el-checkbox>
            <el-checkbox label="恶意攻击谩骂" name="type"></el-checkbox>
            <el-checkbox label="淫秽色情" name="type"></el-checkbox>
            <el-checkbox label="政治反动" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="其他" prop="desc">
          <el-input type="textarea" v-model="bannedReasonElse"></el-input>
        </el-form-item>
        <el-form-item label="永久封禁">
          <el-checkbox v-model="bannedEver"></el-checkbox>
        </el-form-item>
        <el-form-item label="解封时间" prop="date">
          <el-date-picker
            v-model="until"
            type="datetime"
            placeholder="解封时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doBan">确定封禁</el-button>
          <el-button type="primary" @click="cancelBan">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import isEmpty from 'lodash/isEmpty'
  import api from '../../../../service/data/account'
  import cache from '../../../../service/cache'
  export default {
    props: ['name', 'id', 'avatar', 'description'],
    data () {
      return {
        isBanning: false,
        bannedReason: [],
        bannedReasonElse: '',
        bannedEver: false,
        until: '',
        details: [
          {
            key: 'ban',
            icon: 'delete',
            subTitle: '封禁'
          },
          {
            key: 'avatar',
            icon: 'edit',
            subTitle: '清空头像'
          },
          {
            key: 'nick',
            icon: 'edit',
            subTitle: '清空昵称'
          }
        ]
      }
    },
    methods: {
      showBan () {
        this.isBanning = true
      },
      getClasses (index) {
        var remainder = index % 3
        if (remainder === 0) {
          return 'col-md-3 col-md-offset-1'
        } else if (remainder === 2) {
          return 'col-md-4'
        } else {
          return 'col-md-3'
        }
      },
      doBan () {
        let params = {
          user_id: this.id
        }
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        let token = cache.getItem('token')
        params.manager_id = manager.id
        let reason = this.bannedReason.join('_') + '_' + this.bannedReasonElse
        params.reason = reason
        if (!this.bannedEver) {
          params.unbanned_time = this.until
        }
        return api('ban').fetch(params, {token})
          .then(resp => {
            this.isBanning = false
            this.$message.success('封禁用户成功')
          })
      },
      cancelBan () {
        this.isBanning = false
      }
    }
  }

</script>
<style>
  #user-info {
    position: static;
  }
</style>
