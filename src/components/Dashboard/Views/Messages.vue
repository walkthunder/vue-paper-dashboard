<template>
  <div>
    <el-table
      fit
      v-loading="isLoading"
      element-loading-text="数据加载中" :data="list">
      <el-table-column
        prop="_id"
        min-width="110"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="user_name"
        min-width="110"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="create_time"
        min-width="110"
        align="center"
        label="回复时间">
      </el-table-column>
      <el-table-column
        prop="program_name"
        min-width="110"
        align="center"
        label="所属节目">
      </el-table-column>
      <el-table-column
        prop="reply_to.user_name"
        min-width="110"
        align="center"
        label="引用马甲">
      </el-table-column>
      <el-table-column
        prop="reply_to.content"
        min-width="110"
        align="center"
        label="引用内容">
      </el-table-column>
      <el-table-column
        prop="content"
        min-width="110"
        align="center"
        label="回复内容">
      </el-table-column>
      <el-table-column
        prop="reviewed"
        min-width="110"
        :formatter="defaultBool"
        align="center"
        label="是否回复">
      </el-table-column>
      <el-table-column
        prop="thumb_count"
        min-width="110"
        align="center"
        :formatter="defaultNum"
        label="点赞数">
      </el-table-column>
      <el-table-column
        min-width="220"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row" @click.native.prevent="answerHandler(scope.$index, list)">回复</el-button>
          <el-button size="small" :data-content="scope.row" @click.native.prevent="deleteHandler(scope.$index, list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="回复评论" :visible.sync="isAnswering">
      <el-row style="margin-bottom: 20px;">
        <el-col>
          <span :model="answerContent">{{answerContent.user_name}} 回复 {{answerContent.reply_to && answerContent.reply_to.user_name}} : {{answerContent.content}}</span>
          <br>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col :span="12" style="text-align: left;">
          <el-select v-model="useAccountId" placeholder="选择马甲">
            <el-option v-for="account in accounts" :key="account.alt_id" :value="account.alt_id" :label="account.alt_name"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12" style="text-align: left;">
          <el-date-picker
            v-model="answerTime"
            type="datetime"
            placeholder="未选择时实时发布">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-input type="textarea" :rows="5" placeholder="回复" v-model="answerText">
        </el-input>
      </el-row>
      <el-row>
        <el-button type="primary" @click.native.prevent="answer">发布</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="删除回复" :visible.sync="isDeleting">
      <el-form label-width="120px">
        <el-form-item label="选择删除原因" prop="type">
          <el-checkbox-group v-model="deleteReason">
            <el-checkbox label="无意义的回复" name="type"></el-checkbox>
            <el-checkbox label="营销广告" name="type"></el-checkbox>
            <el-checkbox label="恶意攻击谩骂" name="type"></el-checkbox>
            <el-checkbox label="淫秽色情" name="type"></el-checkbox>
            <el-checkbox label="政治反动" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="其他" prop="desc">
          <el-input type="textarea" v-model="deleteReasonElse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doDel">确定删除</el-button>
          <el-button type="primary" @click="cancelDel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment'
  import isEmpty from 'lodash/isEmpty'
  import api from '../../../service/data/reply'
  import accountsAPI from '../../../service/data/account'

  export default {
    data () {
      return {
        total: 0,
        pageNo: 1,
        pageSize: 20,
        manager_id: '',
        isLoading: true,
        list: [],
        useAccountId: '',
        isAnswering: false,
        isDeleting: false,
        answerContent: {},
        answerTime: '',
        answerText: '',
        accounts: [],
        deleteId: '',
        deleteReason: [],
        deleteReasonElse: '',
        date_range: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      confirmManager () {
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        this.manager_id = manager.id
      },
      getAccounts () {
        let params = {manager_id: this.manager_id}
        return Promise.all([accountsAPI('accounts').fetch(params), accountsAPI('random').fetch({})])
          .then(([resp, random]) => {
            // The first one should be default option
            return [ random.data, ...resp.data.alt_accounts ]
          })
      },
      fetchData () {
        this.confirmManager()
        return accountsAPI('messages').fetch({ manager_id: this.manager_id })
          .then(resp => {
            this.isLoading = false
            console.log('messages resp: ', resp)
            if (resp && resp.data) {
              let data = resp.data
              this.list = data.msgs
              this.total = data.total
              this.pageNo = data.page_no
            }
          })
          .catch(err => {
            console.error(err)
            this.isLoading = false
          })
      },
      defaultNum (row, col, val) {
        return val || 0
      },
      defaultBool (row, col, val) {
        return val ? '已回复' : '未回复'
      },
      answerHandler (index, rows) {
        this.confirmManager()
        this.isAnswering = true
        let content = rows[index]
        this.answerContent = content
        // Get available accounts
        this.getAccounts()
          .then(data => {
            console.log('Available accounts  : ', data)
            this.accounts = data
          })
      },
      deleteHandler (index, rows) {
        this.confirmManager()
        this.isDeleting = true
        let content = rows[index]
        this.deleteId = content._id
        console.log('ready to delete content: ', this.deleteId)
      },
      resetDateRange () {
        let beginTime = moment().subtract(7, 'days')
        let endTime = moment().add(1, 'hours')
        this.date_range = [beginTime, endTime]
        return this.date_range
      },
      answer () {
        this.confirmManager()
        let params = {
          manager_id: this.manager_id,
          user_id: this.useAccountId || this.accounts[0].alt_id,
          topic_id: this.answerContent.topic_id,
          reply_to: this.answerContent.reply_to.id,
          content: this.answerText
        }
        if (this.answerTime) {
          params.reply_time = this.answerTime
        }
        api('answer').fetch({}, { ...params })
          .then(resp => {
            this.isAnswering = false
            this.$message.success('回复成功')
            this.resetDateRange()
            this.fetchData()
          })
          .catch(err => {
            console.error(err)
            this.$message.error(err)
          })
      },
      doDel () {
        let reasons = this.deleteReason
        if (this.deleteReasonElse) {
          reasons.push(this.deleteReasonElse)
        }
        console.log('Do delete', reasons)
        if (!this.manager_id) {
          this.confirmManager()
        }
        let params = {
          manager_id: this.manager_id,
          reply_id: this.deleteId,
          reason: reasons.join('_')
        }
        api('delete').fetch({}, params)
          .then(resp => {
            if (resp && resp.data) {
              this.isDeleting = false
              this.$message.success('删除成功')
              this.fetchData()
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('删除失败，请稍后重试')
          })
      },
      cancelDel () {
        this.deleteReason = []
        this.deleteReasonElse = ''
        this.deleteId = ''
        this.isDeleting = false
      }
    }
  }
</script>
<style>

</style>
