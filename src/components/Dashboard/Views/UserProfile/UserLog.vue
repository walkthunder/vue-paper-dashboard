<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" mode="horizontal" @select="selectHandler" class="menu">
      <el-menu-item index="1">节目回复</el-menu-item>
      <el-menu-item index="2">专辑回复</el-menu-item>
      <el-menu-item index="3">购买记录</el-menu-item>
    </el-menu>
    <el-table
      key="programTable"
      v-if="activeIndex == 1"
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      :data="programReply"
      style="width: 100%;"
      border>
      <el-table-column
        prop="_id"
        min-width="110"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="create_time"
        :formatter="timeFormat"
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
        prop="content"
        min-width="110"
        align="center"
        label="回复内容">
      </el-table-column>
      <el-table-column
        prop="thumb_count"
        :formatter="defaultNum"
        min-width="110"
        align="center"
        label="点赞数">
      </el-table-column>
      <el-table-column
        min-width="110"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row" @click.native.prevent="deleteHandler(scope.$index, programReply)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      key="albumTable"
      v-if="activeIndex == 2"
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      :data="albumReply"
      style="width: 100%;"
      border>
      <el-table-column
        prop="_id"
        min-width="110"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="create_time"
        :formatter="timeFormat"
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
        prop="content"
        min-width="110"
        align="center"
        label="回复内容">
      </el-table-column>
      <el-table-column
        prop="thumb_count"
        :formatter="defaultNum"
        min-width="110"
        align="center"
        label="点赞数">
      </el-table-column>
      <el-table-column
        min-width="110"
        align="center"
        label="操作">
        <template scope="scope">
          <el-button size="small" :data-content="scope.row" @click.native.prevent="deleteHandler(scope.$index, programReply)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      key="shopTable"
      v-if="activeIndex == 3"
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      :data="shopLog"
      style="width: 100%;"
      border>
      <el-table-column
        prop="paid_time"
        min-width="110"
        align="center"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="_purchase_item.channel_id"
        min-width="110"
        align="center"
        label="专辑ID">
      </el-table-column>
      <el-table-column
        prop="id"
        min-width="110"
        align="center"
        label="商品ID">
      </el-table-column>
      <el-table-column
        prop="_purchase_item.name"
        min-width="110"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="vendor"
        min-width="110"
        align="center"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="_purchase_item.original_fee"
        min-width="110"
        align="center"
        label="原价">
      </el-table-column>
      <el-table-column
        prop="actual_fee"
        min-width="110"
        align="center"
        label="支付">
      </el-table-column>
    </el-table>
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
  import moment from 'moment'
  import api from '../../../../service/data/reply'
  import accountAPI from '../../../../service/data/account'
  import cache from '../../../../service/cache'
  export default {
    props: ['userId'],
    data () {
      return {
        manager_id: this.$getUser().id,
        isLoading: true,
        isDeleting: false,
        deleteReason: [],
        deleteReasonElse: '',
        activeIndex: '1',
        reply_type: 'PROGRAM',
        pageNo: 1,
        pageSize: 20,
        programReply: [],
        albumReply: [],
        shopLog: []
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.selectHandler('1')
      })
    },
    watch: {
      '$route': 'selectHandler'
    },
    methods: {
      confirmLogged () {
        this.manager_id = this.$getUser().id
        if (!this.manager_id) {
          this.$localStorage.set('afterLogin', 'accounts')
          this.$router.push({ name: 'login' })
        }
      },
      fetchData (dataPromise) {
        return dataPromise.then(resp => {
          if (resp) {
            this.isLoading = false
            if (this.activeIndex === '1') {
              this.programReply = resp.data && resp.data.reply
            } else if (this.activeIndex === '2') {
              this.albumReply = resp.data && resp.data.reply
            } else {
              let data = resp.data || []
              console.log('client get shop list: ', data)
              this.shopLog = data
            }
          }
        })
        .catch(err => {
          console.error(err)
          this.isLoading = false
        })
      },
      selectHandler (key, path) {
        this.confirmLogged()
        if (key) {
          this.isLoading = true
          this.activeIndex = key
        } else {
          this.activeIndex = '1'
        }
        let token = cache.getItem('token')
        let params = {}
        this.pageNo && (params.page_no = this.pageNo)
        this.pageSize && (params.page_size = this.pageSize)
        this.userId && (params.user_id = this.userId)
        let dataPromise = Promise.resolve()
        if (this.activeIndex.toString() === '1') {
          this.reply_type = 'PROGRAM'
          params.reply_type = this.reply_type
          dataPromise = api('reply').fetch(params, {token})
        } else if (this.activeIndex.toString() === '2') {
          this.reply_type = 'ALBUM'
          params.reply_type = this.reply_type
          dataPromise = api('reply').fetch(params, {token})
        } else {
          // Shop history
          dataPromise = accountAPI('shop_list').fetch({ userId: this.userId }, {token})
        }
        return this.fetchData(dataPromise)
      },
      timeFormat (row, col, val) {
        return moment(parseInt(val, 10) * 1000).format('MMMM Do YYYY, h:mm:ss a').toString()
      },
      defaultNum (row, col, val) {
        return val || 0
      },
      deleteHandler (index, contents) {
        this.deleteId = contents[index]._id
        this.isDeleting = true
        this.manager_id = this.$getUser().id
        if (!this.manager_id) {
          this.$localStorage.set('afterLogin', 'accounts')
          this.$router.push({ name: 'login' })
        }
      },
      doDel () {
        this.confirmLogged()
        let reasons = this.deleteReason
        if (this.deleteReasonElse) {
          reasons.push(this.deleteReasonElse)
        }
        let token = cache.getItem('token')
        let params = {
          manager_id: this.manager_id,
          reply_id: this.deleteId,
          reason: reasons.join('_'),
          token
        }
        api('delete').fetch({}, params)
          .then(resp => {
            if (resp && resp.data) {
              this.isDeleting = false
              this.$message.success('删除成功')
              this.selectHandler()
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
  .menu {
    border-radius: 6px;
    padding: 0 15px;
  }

</style>
