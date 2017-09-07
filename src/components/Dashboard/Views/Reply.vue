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
        label="名称">
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
        prop="user_name"
        min-width="220"
        align="center"
        label="操作">
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
  </div>
</template>

<script>
  import api from '../../../service/data/reply'
  import moment from 'moment'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'

  export default {
    components: {ElButton},
    data () {
      return {
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
        let endTime = moment()
        this.date_range = [beginTime, endTime]
        return this.date_range
      },
      fetchData (withoutCategory = false) {
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
        let catPromise = Promise.resolve()
        if (!withoutCategory) {
          catPromise = api('categories').fetch({})
        }
        return Promise.all([catPromise, api('reply').fetch(params)])
          .then(([resp, reply]) => {
            let replies = reply.data.reply || []
            this.mTotal = reply.data.total
            if (!replies || replies.length === 0) {
              // TODO: Remove mock data
              replies.push({
                user_avatar: 'http://q.qlogo.cn/qqapp/100387802/9229501C45EACC8CAC95C4BFC31BF782/40',
                podcaster: [
                  '4e44a2268f9901d970d49f6206f20f7a'
                ],
                content: '周建龙说得不错',
                create_time: 1468552833.759241,
                topic_id: '56c9c09e8679506255c19302',
                user_id: 'e14381b56d5b357d76c5c1f83b4d610a',
                _id: '57885681066afb3c908435f7',
                user_name: '零下℃',
                program_name: '矮大紧指北',
                thumb_count: 1,
                reply_to: {
                  content: '挺好的，刚听完一个800多集的，来听这个。',
                  user_name: '@无处安放',
                  user_id: 'aabb905172ce375ee325321e839b785c',
                  id: '58c3edc5066afb5c517c9b4e'
                }
              })
            }
            this.contents = replies
            if (!withoutCategory) {
              this.categories = [ ...resp.data, {
                id: 0,
                name: '全部',
                status: 99
              }]
            }
          })
          .then(() => {
            this.mContentLoading = false
          })
      },
      dataFormat (row, col, val) {
        if (val) {
          return moment(val).format('MMMM Do YYYY')
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
