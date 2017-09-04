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
          <el-button size="small" :data-id="scope.row.alt_id" @click="editBtnHandler">编辑</el-button>
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
      <el-form :model="editing">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="editing.alt_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="editing.alt_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否官方" :label-width="formLabelWidth">
          <el-checkbox v-model="editing.official"></el-checkbox>
        </el-form-item>
        <el-form-item label="所属小编" :label-width="formLabelWidth">
          <el-select v-model="editing.owners" multiple placeholder="Select">
            <el-option
              v-for="manager in managers"
              :key="manager.value"
              :label="manager.nickname"
              :value="manager.nickname"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmHandler">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../../service/data/account'
  import moment from 'moment'
  import ElCheckbox from '../../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue'
  import ElOption from '../../../../node_modules/element-ui/packages/select/src/option.vue'
  export default {
    components: {
      ElOption,
      ElCheckbox},
    props: ['user'],
    data () {
      return {
        manager_id: 123,
        editing: {},
        total: 0,
        current: 1,
        keyword: '',
        type: '',
        list: [],
        isLoading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        /* eslint-disable */
        managers: [{
          "id": 48,
          "nickname": "颜飞",
          "phone": "",
          "avatar": "http://qingting-pic.b0.upaiyun.com/2014/0922/20140922164102831.jpg",
          "sex": 0,
          "signature": ""
          },
          {
            "_id": 0,
            "id": 50,
            "nickname": "徐蕊",
            "phone": "",
            "avatar": "http://qingting-pic.b0.upaiyun.com/2014/0922/20140922145320150.jpg",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 51,
            "nickname": "李凌",
            "phone": "",
            "avatar": "http://qingting-pic.b0.upaiyun.com/2014/0918/20140918180629721.jpg",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 52,
            "nickname": "周杨洁",
            "phone": "",
            "avatar": "http://qingting-pic.b0.upaiyun.com/2014/0922/20140922164152791.jpg",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 70,
            "nickname": "于文",
            "phone": "",
            "avatar": "http://pic.qingting.fm/2016/0203/2016020317564611.jpg",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 71,
            "nickname": "陈静",
            "phone": "",
            "avatar": "",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 73,
            "nickname": "苗义",
            "phone": "",
            "avatar": "",
            "sex": 0,
            "signature": ""
          },
          {
            "_id": 0,
            "id": 87,
            "nickname": "龙涛 - 产品",
            "phone": "",
            "avatar": "http://qingting-pic.b0.upaiyun.com/2014/1023/20141023115949408.png",
            "sex": 0,
            "signature": ""
          }],
        /* eslint-enable */
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
        return Promise.all([api('accounts').fetch([this.manager_id]), api('managers').fetch([])])
          .then(([response, managersResp]) => {
            this.isLoading = false
            if (response.data) {
              this.list = response.data.alt_accounts
              this.total = this.list.length
            } else {
              this.list = []
              this.total = 0
            }

            // Managers
            if (managersResp && managersResp.data) {
              this.managers = managersResp.data.list
            }
          }).catch(() => {
            this.isLoading = false
          })
      },
      getAltAccountFromCurList (id) {
        if (id === undefined || id === null) {
          return undefined
        }
        for (const account of this.list) {
          if (account && account.alt_id && account.alt_id.toString() === id.toString()) {
            return { ...account }
          }
        }
        return undefined
      },
      mergeAltAccountToCurList (account) {
        if (account && account.alt_id) {
          let id = account.alt_id.toString()
          for (let i = 0; i < this.list.length; i++) {
            let item = this.list[i]
            if (item && item.alt_id && item.alt_id.toString() === id) {
              console.log(`[mergeAltAccountToCurList] item(${JSON.stringify(item)}) replaced with ${JSON.stringify(account)}`)
              item = { ...item, ...account }
              this.list.splice(i, 1, item)
              return
            }
          }
          console.log(`[mergeAltAccountToCurList] new account(${JSON.stringify(account)}) added into list`)
          this.list.push(account)
        }
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
      },
      // TODO: disable till data loaded. Or else id would be undefined
      editBtnHandler (e) {
        let target = e.target
        if (target.firstElementChild === null) {
          target = target.parentNode
        }
        const id = target.dataset.id
        window.list = this.list
        this.editing = this.getAltAccountFromCurList(id)
        this.dialogFormVisible = true
      },
      confirmHandler (e) {
        let params = { ...this.editing, manager_id: this.manager_id }
        api('update_account').fetch([], { params })
          .catch(err => {
            console.error(err)
            return false
          })
          .then(resp => {
            console.log(resp)
            if (resp && resp.data) {
              // Update success, reload the list
              this.mergeAltAccountToCurList(this.editing)
            }
            return resp
          })
        this.dialogFormVisible = false
      }
    }
  }
</script>
<style>
  .v-modal {
    z-index: 0 !important;
  }
</style>
