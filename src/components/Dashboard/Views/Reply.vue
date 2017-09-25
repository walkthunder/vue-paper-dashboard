<template>
  <div class="content is-left">
    <div class="tabs" style="margin-bottom:10px;">
      <span class="tab"
            v-for="category in categories"
            @click="selectCategory(category)"
            :class="{'is-active': category.id == $route.params.category_id}">
        {{category.name}}
        <small v-if="category.status != 99" style="text-decoration: underline">(下线)</small>
      </span>
    </div>
    <br>
    <el-row>
      <el-col :span="5">
        <el-date-picker
          placeholder="回复时间"
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
      v-loading="mContentLoading"
      element-loading-text="评论数据加载中" :data="contents">
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
        <template scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="gotoAccount(scope.$index, contents)">
            {{scope.row.user_name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        :formatter="dataFormat"
        min-width="110"
        align="center"
        label="回复时间">
      </el-table-column>
      <el-table-column
        prop="program_name"
        min-width="220"
        align="center"
        label="所属节目">
      </el-table-column>
      <el-table-column
        prop="reply_to.user_name"
        :formatter="defaultStr"
        min-width="110"
        align="center"
        label="引用用户">
        <template scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="gotoUserAccount(scope.$index, contents)">
            {{scope.row.reply_to.user_name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="reply_to.content"
        :formatter="defaultStr"
        min-width="220"
        align="center"
        label="引用内容">
      </el-table-column>
      <el-table-column
        prop="content"
        min-width="220"
        align="center"
        label="回复内容">
      </el-table-column>
      <el-table-column
        prop="thumb_count"
        :formatter="defaultNum"
        min-width="80"
        align="center"
        label="点赞数">
      </el-table-column>
      <el-table-column
        min-width="220"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row" @click.native.prevent="answerHandler(scope.$index, contents)">回复</el-button>
          <el-button size="small" :data-content="scope.row" @click.native.prevent="deleteHandler(scope.$index, contents)">删除</el-button>
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
        :total=this.mTotal>
      </el-pagination>
    </div>
    <el-dialog title="回复评论" :visible.sync="isAnswering" :modal-append-to-body="false">
      <el-row style="margin-bottom: 20px;">
        <el-col>
        <span :model="answerContent">{{answerContent.user_name}} 回复 {{answerContent.reply_to && answerContent.reply_to.user_name}} : {{answerContent.content}}</span>
        <br>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col :span="12" style="text-align: left;">
          <el-select v-model="useAccountId" placeholder="选择马甲" @change="selectAccount">
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
    <el-dialog title="删除回复" :visible.sync="isDeleting" :modal-append-to-body="false">
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
  import isEmpty from 'lodash/isEmpty'
  import api from '../../../service/data/reply'
  import accountsAPI from '../../../service/data/account'
  import moment from 'moment'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElDialog from '../../../../node_modules/element-ui/packages/dialog/src/component.vue'
  import cache from '../../../service/cache'
  export default {
    components: {
      ElDialog,
      ElButton},
    data () {
      return {
        token: '',
        manager_id: '',
        isAnswering: false,
        answerContent: {},
        answerTime: '',
        answerText: '',
        accounts: [],
        useAccountId: '',
        isDeleting: false,
        deleteId: '',
        deleteReason: [],
        deleteReasonElse: '',
        date_range: '',
        mCategoryId: 0,
        mContentLoading: true,
        mTotal: 0,
        replyType: '',
        sCategoryId: '',
        sUserName: '',
        sUserId: '',
        sAlbumName: '',
        pageNo: 1,
        pageSize: 20,
        categories: [{
          id: 0,
          name: '全部',
          status: 99
        }],
        contents: []
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
      search (e) {
        console.log('search start')
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
      },
      confirmManager () {
        let manager = this.$getUser()
        if (isEmpty(manager)) {
          this.$localStorage.set('afterLogin', this.$route.fullPath)
          this.$router.push('/login')
          return
        }
        this.manager_id = manager.id
      },
      fetchData (withoutCategory = false) {
        this.confirmManager()
        this.mContentLoading = true
        let params = {}
        this.pageNo && (params.page_no = this.pageNo)
        this.pageSize && (params.page_size = this.pageSize)
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
        if (this.mCategoryId) {
          params.category = this.mCategoryId
        }
        this.token = cache.getItem('token')
        let catPromise = Promise.resolve()
        if (!withoutCategory) {
          catPromise = api('categories').fetch({}, {params: {token: this.token}})
        }
        return Promise.all([catPromise, api('reply').fetch(params, {params: {token: this.token}})])
          .then(([resp, reply]) => {
            this.mContentLoading = false
            let replies = reply.data.reply || []
            this.mTotal = reply.data.total
            for (let i = 0; i < replies.length; i++) {
              let rep = replies[i]
              rep = rep || {}
              rep.reply_to = rep.reply_to || {}
            }
            this.contents = replies
            if (!withoutCategory) {
              this.categories = [{
                id: 0,
                name: '全部',
                status: 99
              }, ...resp.data]
            }
          })
          .catch(err => {
            console.error(err)
            this.mContentLoading = false
          })
      },
      dataFormat (row, col, val) {
        if (val) {
          return moment(val * 1000).format('MMMM Do YYYY')
        }
        return ''
      },
      defaultStr (row, col, val) {
        return val || '-'
      },
      defaultNum (row, col, val) {
        return val || 0
      },
      selectCategory (category) {
        this.mCategoryId = category.id || 0
        this.resetDateRange()
        this.mTotal = 0
        this.sUserName = ''
        this.sUserId = ''
        this.sAlbumName = ''
        this.pageNo = 1
        this.contents = []
        this.fetchData(true)
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      handleSizeChange (val) {
        console.log(`${val} items per page`)
        this.pageSize = val
        this.fetchData(true)
          .then(resp => {
            this.$message.success('列表更新')
          })
      },
      handleCurrentChange (val) {
        console.log(`current page: ${val}`)
        this.pageNo = val
        this.fetchData(true)
          .then(resp => {
            this.$message.success('列表更新')
          })
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
      getAccounts () {
        this.token = cache.getItem('token')
        let params = {manager_id: this.manager_id}
        return Promise.all([accountsAPI('accounts').fetch(params, {token: this.token}), accountsAPI('random').fetch({}, {token: this.token})])
          .then(([resp, random]) => {
            // The first one should be default option
            return [ random.data, ...resp.data.alt_accounts ]
          })
      },
      selectAccount () {
        console.log(' Account selected: ', this.useAccountId)
      },
      answer () {
        if (!this.manager_id) {
          this.confirmManager()
        }
        this.token = cache.getItem('token')
        let params = {
          manager_id: this.manager_id,
          user_id: this.useAccountId || this.accounts[0].alt_id,
          topic_id: this.answerContent.topic_id,
          reply_to: this.answerContent.reply_to.id,
          content: this.answerText,
          token: this.token
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
        this.token = cache.getItem('token')
        let params = {
          manager_id: this.manager_id,
          reply_id: this.deleteId,
          reason: reasons.join('_'),
          token: this.token
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
      },
      gotoAccount (index, contents) {
        console.log('go to account: ', contents[index].user_id)
        this.$router.push(`/account/${contents[index].user_id}`)
      },
      gotoUserAccount (index, contents) {
        console.log('go to account: ', contents[index].reply_to)
        this.$router.push(`/account/${contents[index].reply_to.user_id}`)
      }
    }
  }
</script>

<style scoped>
  .tags {
    font-size: 12px;
    padding: 2px 5px;
  }
  .tags:not(:first-child) {
    border-top: 1px solid #eee;
  }
  .tag,.tag-title {
    color: #555;
    cursor: pointer;
    padding: 3px 10px;
    margin: 5px;
    display: inline-block;
  }
  .tag-title {
    font-weight: 800;
    color: #333;
    cursor: default;
  }
  .tag-title:after {
    content: ':';
  }
  .tag:hover {
    color: #20a0ff;
  }
  .tag.is-active {
    background: #4db3ff;
    color: #fff;
  }
  dt {
    width:110px;
    padding-top: 8px;
    font-size: 12px;
    vertical-align: top;
  }

</style>
