<template>
  <div class="content is-left">
    <h3>马甲列表</h3>
    <br>
    <el-table
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      border
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="alt_id"
        min-width="110"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="alt_name"
        min-width="220"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="official"
        min-width="110"
        align="center"
        label="是否官方">
        <template scope="scope">
          <el-tag
            :type="scope.row.official ? 'primary' : 'gray'"
            close-transition>{{scope.row.official}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="owners"
        min-width="220"
        align="center"
        label="所属小编">
      </el-table-column>
      <el-table-column
        prop="create_time"
        :formatter="dataFormat"
        min-width="140"
        align="center"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="action"
        min-width="110"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" @click="dialogFormVisible = true">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block is-left">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="20"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="马甲编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../../service/data/account'
  import moment from 'moment'
  export default {
    props: ['user'],
    data () {
      return {
        total: 0,
        current: 1,
        keyword: '',
        type: '',
        list: [],
        isLoading: true,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
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
      fetchData () {
        this.isLoading = true
        this.manager_id = '000'
        api('accounts').fetch([this.manager_id]).then(response => {
          this.isLoading = false
          if (response.data) {
            console.log('---debug---data: ', response.data)
            this.list = response.data.alt_accounts
            this.total = this.list.length
          } else {
            this.list = []
            this.total = 0
          }
        }).catch(() => {
          this.isLoading = false
        })
      },
      dataFormat (row, col, val) {
        if (val) {
          return moment(val).format('MMMM Do YYYY')
        }
        return ''
      },
      filter (type) {
        this.current = 1
        this.keyword = ''
        this.type = type
        this.fetchData()
      },
      handleCurrentChange () {
        this.fetchData()
      }
    }
  }
</script>
<style>
  .v-modal {
    z-index: 0 !important;
  }
</style>
