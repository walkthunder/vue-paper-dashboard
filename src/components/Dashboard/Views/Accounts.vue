<template>
  <div class="content is-left">
    <el-row :gutter="22">
      <el-col :span="9">
        <el-input
        @keyup.native.enter="search"
        placeholder="马甲名称"
        v-model="s_nick" style="width: 300px">
        <el-button slot="append" icon="search" @click="search"></el-button>
      </el-input>
      </el-col>
      <el-col :span="9">
        <el-input
          @keyup.native.enter="search"
          placeholder="马甲ID"
          v-model="s_id" style="width: 300px">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="large" :data-new=true @click="editBtnHandler">新增</el-button>
      </el-col>
      <el-col :offset="6" :span="6">
      </el-col>
    </el-row>
    <br>
    <el-table
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      border
      :data="list"
      style="width: 100%;">
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
            close-transition>{{scope.row.official || false}}</el-tag>
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
          <el-button size="small" :data-id="scope.row.alt_id" :data-new=false @click="editBtnHandler">编辑</el-button>
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
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="editing.alt_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <pic-upload :width="160" :height="'auto'" :needCheckSize="false" v-on:updateURL="updateURL" :url="editing.alt_avatar"></pic-upload>
        </el-form-item>
        <el-form-item label="是否官方" :label-width="formLabelWidth">
          <el-checkbox v-model="editing.official"></el-checkbox>
        </el-form-item>
        <el-form-item label="所属小编" :label-width="formLabelWidth">
          <el-select v-model="editing.owners" multiple clearable placeholder="Select" @change="onSelect">
            <el-option
              v-for="manager in managers"
              :key="manager.id"
              :label="manager.nickname"
              :value="manager.id"></el-option>
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
  import isEmpty from 'lodash/isEmpty'
  import ElCheckbox from '../../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue'
  import ElOption from '../../../../node_modules/element-ui/packages/select/src/option.vue'
  import ElFormItem from '../../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import PicUpload from '../../UIComponents/PicUpload.vue'
  import cache from '../../../service/cache'
  // TODO: [Vue warn]: <transition-group> children must be keyed: <ElTag>
  export default {
    components: {
      ElFormItem,
      ElOption,
      ElCheckbox,
      PicUpload
    },
    props: ['user'],
    data () {
      return {
        s_id: '', // search alt_id
        s_nick: '', // search param alt_name
        manager_id: 123,
        editNotNewMode: 'true',
        editing: {
          alt_id: '',
          alt_name: '',
          alt_avatar: '',
          official: false,
          owners: [],
          ownerIds: []
        },
        total: 0,
        current: 1,
        keyword: '',
        type: '',
        list: [],
        isLoading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        /* eslint-disable */
        managers: [],
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
      search (e) {
        console.log('log start', e, this.s_nick)
        const withoutManager = true
        this.fetchData(withoutManager)
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      updateURL (url) {
        this.editing.alt_avatar = url
      },
      fetchData (withoutManagers = false) {
        this.isLoading = true
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        this.manager_id = manager && manager.id
        let params = {manager_id: this.manager_id}
        let token = cache.getItem('token')
        let managersPromise = Promise.resolve()
        if (!withoutManagers) {
          managersPromise = api('managers').fetch({}, {params: {token}})
        }
        return Promise.all([api('accounts').fetch(params, {params: {token}}), managersPromise])
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
      _matchManagerIdWithName (name) {
        if (this.managers) {
          for (let index = 0; index < this.managers.length; index++) {
            let manager = this.managers[index]
            if (manager.nickname === name) {
              return manager.id
            }
          }
        }
        return undefined
      },
      editBtnHandler (e) {
        let target = e.target
        if (target.firstElementChild === null) {
          target = target.parentNode
        }
        const id = target.dataset.id
        if (id) {
          this.editing = this.getAltAccountFromCurList(id)
          if (this.editing && this.editing.owners) {
            this.editing.ownerIds = this.editing.owners.map(owner => this._matchManagerIdWithName(owner))
          }
        } else {
          this.editing = { owners: [] } // To skip an element bug TODO: Fix element bug
        }
        this.editNotNewMode = !target.dataset.new
        this.dialogFormVisible = true
      },
      onSelect (val) {
        console.log('sync managers: ', val)
        if (this.editing && this.editing.owners) {
          this.editing.ownerIds = this.editing.owners.map(owner => this._matchManagerIdWithName(owner))
        }
      },
      confirmHandler (e) {
        let token = cache.getItem('token')
        let params = { ...this.editing, manager_id: this.manager_id, token }
        if (params.ownerIds) {
          params.owners = params.ownerIds.join('_')
        }
        let requestPromise
        if (!this.editNotNewMode) { // New account
          delete (params.alt_id)
          requestPromise = api('post_account').fetch({}, { ...params })
        } else { // Edit mode
          requestPromise = api('update_account').fetch({}, { ...params })
        }
        requestPromise
          .catch(err => {
            console.error(err)
            this.$message.error('编辑上传失败，请稍后重试')
            return false
          })
          .then(resp => {
            if (resp && resp.data) {
              // Update success, reload the list
              if (this.editNotNewMode) {
                this.mergeAltAccountToCurList(this.editing)
              } else {
                this.fetchData(true)
              }
              this.$message.success('修改成功')
            } else {
              this.$message.error('编辑上传失败，请稍后重试')
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
