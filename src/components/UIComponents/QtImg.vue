<template lang="html">
  <div class="qtimg">
    <img
      v-show="src"
      :src="url"
      :style="{'width': isNaN(width) ? width : width + 'px',
              'height': isNaN(height) ? height : height + 'px'}">
    <div
      class="default-img"
      :style="{'width': isNaN(width) ? width : width + 'px',
               'height': isNaN(height) ? height : height + 'px',
               'line-height': height + 'px',
               'font-size': height / 5 + 'px'}"
      v-show="!src">
      蜻蜓FM
    </div>
  </div>
</template>

<script>
export default {
  name: 'qt-img',
  props: {
    'src': String,
    'width': {
      default: 150
    },
    'height': {
      default: 150
    },
    'postfix': {
      default: '!200'
    }
  },
  computed: {
    url () {
      var value = this.src
      if (value && value.search('pic.qingting.fm') > -1) {
        return value.replace('http:', window.location.protocol) + this.postfix
      } else if (value && value.search('qlogo') > -1) {
        return value.replace('http:', window.location.protocol)
      }
      return value
    }
  }
}
</script>

<style scoped>
.qtimg {
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
}
.default-img {
  display: inline-block;
  font-weight: 800;
  text-align: center;
  color: rgba(16, 16, 16, 0.5);
  background-color: #ddd;
  opacity: 0.5;
  vertical-align: top;
  margin: 5px 0;
}
</style>
