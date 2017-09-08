<template>
  <div class="card card-user">
    <div class="image">
      <img src="/static/img/background.jpg" alt="...">
    </div>
    <div class="content">
      <div class="author">
        <img class="avatar border-white" :src="this.avatar" alt="...">
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
        <div v-for="(info,index) in details" :class="getClasses(index)">
          <el-button type="primary" :icon="info.icon"></el-button>
          <h5>
            <small>{{info.subTitle}}</small>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['name', 'id', 'avatar', 'description'],
    data () {
      return {
        details: [
          {
            icon: 'delete',
            title: '12',
            subTitle: '封禁'
          },
          {
            icon: 'edit',
            title: '2GB',
            subTitle: '清空头像'
          },
          {
            icon: 'edit',
            title: '24,6$',
            subTitle: '清空昵称'
          }
        ]
      }
    },
    methods: {
      getClasses (index) {
        var remainder = index % 3
        if (remainder === 0) {
          return 'col-md-3 col-md-offset-1'
        } else if (remainder === 2) {
          return 'col-md-4'
        } else {
          return 'col-md-3'
        }
      }
    }
  }

</script>
<style>

</style>
