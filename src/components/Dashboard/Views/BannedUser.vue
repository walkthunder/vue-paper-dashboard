<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="用户名"
          v-model="userName" style="width: 220px">
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input
          placeholder="用户ID"
          v-model="userId" style="width: 220px">
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
        prop="user_id"
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
        prop="banned_time"
        min-width="110"
        align="center"
        label="封禁时间">
      </el-table-column>
      <el-table-column
        prop="until"
        min-width="110"
        align="center"
        label="解禁时间">
      </el-table-column>
      <el-table-column
        prop="reason"
        min-width="110"
        align="center"
        label="原因">
      </el-table-column>
      <el-table-column
        prop="manager_id"
        min-width="110"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        min-width="220"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row" @click.native.prevent="unban(scope.$index, list)">解封</el-button>
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
  import api from '../../../service/data/account'
  import isEmpty from 'lodash/isEmpty'
  import ElFormItem from '../../../../node_modules/element-ui/packages/form/src/form-item.vue'
  export default {
    components: {ElFormItem},
    data () {
      return {
        isLoading: true,
        userId: '',
        userName: '',
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 20
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    methods: {
      unban (index, list) {
        console.log(' 解禁 ', list[index])
        let params = {
          user_id: list[index].user_id
        }
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        params.manager_id = manager.id
        return api('unban').fetch(params)
          .then(resp => {
            this.$message.success('解禁用户成功')
            this.fetchData()
          })
      },
      fetchData () {
        this.isLoading = true
        let params = {
          page_no: this.pageNo,
          page_size: this.pageSize
        }
        if (this.userId) {
          params.user_id = this.userId
        }
        if (this.userName) {
          params.user_name = this.userName
        }
        return api('banned_list').fetch(params)
          .then(resp => {
            this.isLoading = false
            console.log('fetch list: ', resp)
            if (resp && resp.data) {
              this.list = resp.data.banned_users
              this.total = resp.data.total
            }
          })
      },
      handleSizeChange (val) {
        console.log(`${val} items per page`)
        this.pageSize = val
        this.pageNo = 1
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      handleCurrentChange (val) {
        this.pageNo = val
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      search (e) {
        this.fetchData()
          .then(resp => {
            this.$message.success('列表更新')
          })
      }
    }
  }
</script>
<style>

</style>
