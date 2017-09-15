<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-date-picker
          placeholder="删除时间"
          v-model="date_range"
          type="daterange"
          align="center"
          style="width: 220px">
        </el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="用户名"
          v-model="sUserName" style="width: 220px">
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="用户ID"
          v-model="sUserId" style="width: 220px">
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="专辑名"
          v-model="sAlbumName" style="width: 220px">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="search" @click="search">查询</el-button>
      </el-col>
      <el-col :offset="6" :span="6">
      </el-col>
    </el-row>
    <br>
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
        :formatter="timeFormat"
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
        prop="content"
        min-width="110"
        align="center"
        label="回复内容">
      </el-table-column>
      <el-table-column
        prop="delete_time"
        :formatter="timeFormat"
        min-width="110"
        align="center"
        label="删除时间">
      </el-table-column>
      <el-table-column
        prop="delete_reason"
        :formatter="reasonFormat"
        min-width="110"
        align="center"
        label="删除原因">
      </el-table-column>
      <el-table-column
        prop="manager_id"
        min-width="110"
        :formatter="adminMatch"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        min-width="100"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row">还原</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <el-pagination
        :current-page.sync=this.pageNo
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size=this.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.total>
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import isEmpty from 'lodash/isEmpty'
  import cache from '../../../service/cache'
  import api from '../../../service/data/reply'
  import accountAPI from '../../../service/data/account'
  export default {
    data () {
      return {
        sUserName: '',
        sUserId: '',
        sAlbumName: '',
        pageNo: 1,
        pageSize: 20,
        total: 0,
        isLoading: true,
        manager_id: '',
        token: '',
        date_range: [],
        list: [],
        accounts: []
      }
    },
    mounted () {
      let beginTime = moment().subtract(7, 'days')
      let endTime = moment()
      this.date_range = [beginTime, endTime]
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      confirmLogged () {
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        this.manager_id = manager.id
      },
      fetchData () {
        this.confirmLogged()
        this.token = cache.getItem('token')
        let params = {
          page_no: this.pageNo,
          page_size: this.pageSize
        }
        this.sUserName && (params.user_name = this.sUserName)
        this.sUserId && (params.user_id = this.sUserId)
        this.sAlbumName && (params.album_name = this.sAlbumName)
        if (this.date_range && this.date_range[0] && this.date_range[1]) {
          params.begin_time = Math.floor(moment(this.date_range[0]).valueOf() / 1000)
          params.end_time = Math.floor(moment(this.date_range[1]).valueOf() / 1000)
        } else {
          let [begin, end] = this.resetDateRange()
          params.begin_time = Math.floor(moment(begin).valueOf() / 1000)
          params.end_time = Math.floor(moment(end).valueOf() / 1000)
        }
        let token = this.token
        return Promise.all([api('deleted_reply').fetch(params, {token}), accountAPI('managers').fetch({}, {params: {token}})])
          .then(([resp, accounts]) => {
            if (resp && resp.data) {
              this.list = resp.data.reply
              this.pageNo = resp.data.page_no
              this.pageSize = resp.data.page_size
              this.total = resp.data.total
            }
            if (accounts && accounts.data) {
              this.accounts = accounts.data.list || []
            }
            this.isLoading = false
          })
          .catch(err => {
            console.error(err)
            this.isLoading = false
          })
      },
      timeFormat (row, col, val) {
        if (val) {
          return moment(val * 1000).format('MMMM Do YYYY')
        }
        return ''
      },
      reasonFormat (row, col, val) {
        if (val) {
          return val.split('_').join(', ')
        }
        return ''
      },
      adminMatch (row, col, val) {
        let accounts = this.accounts
        if (val && accounts) {
          for (let i = 0; i < accounts.length; i++) {
            let cur = accounts[i]
            if (cur && cur.id === val) {
              return cur.nickname
            }
          }
        }
        return `ID: ${val}`
      },
      handleSizeChange (val) {
        console.log(`${val} items per page`)
        this.pageSize = val
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      handleCurrentChange (val) {
        console.log(`current page: ${val}`)
        this.pageNo = val
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      search () {
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      resetDateRange () {
        let beginTime = moment().subtract(7, 'days')
        let endTime = moment().add(1, 'hours')
        this.date_range = [beginTime, endTime]
        return this.date_range
      }
    }
  }

</script>
<style>

</style>
