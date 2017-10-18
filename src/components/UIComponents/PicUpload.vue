<template lang='html'>
  <div>
    <div>
      <qt-img
        :src="url || urlStr"
        postfix=""
        :width="picW"
        :height="picH">
      </qt-img>
    </div>
    <p>
      <small v-show="this.needCheckSize">
        上传图片尺寸要求: {{width}}*{{height}}；图片文件支持JPG、PNG等格式。
      </small>
    </p>
    <p>
      <el-button @click="select"
              size="small"
              v-show="!isError"
              type="primary" :loading="isUploading" icon="picture" >上传图片</el-button>
      <el-button @click="retry"
              size="small"
              v-show="isError"
              type="primary" icon="warning">上传失败，点击重试</el-button>
    </p>
    <input ref="file" type="file" @change='change' accept=".jPG,.jPEG,.PNG,.BMP">
  </div>
</template>

<script>
import FileItem from '../../service/upload'
import api from '../../service/data/account'

export default {
  name: 'pic-upload-plus',
  props: {
    needCheckSize: {
      default: true
    },
    width: {
      default: 800
    },
    height: {
      default: 800
    },
    url: String,
    text: String
  },
  data: function () {
    return {
      file: {},
      status: 0,
      isUploading: false,
      isError: false,
      urlStr: '',
      options: {
        url: '//v0.api.upyun.com/qingting-pic',
        formData: {
        },
        responseType: 'json'
      },
      postfix: '!'
    }
  },
  computed: {
    picW () {
      return (isNaN(this.picH) && this.width) || this.width * this.picH / this.height
    },
    picH () {
      return (isNaN(this.height) && 'auto') || 150
    }
  },
  created: function () {
    this.options.success = this.success
    this.options.error = this.refresh_token
    this.options.before = (file) => {
      this.isUploading = true
    }
    this.options.end = () => {
      this.isUploading = false
    }
  },
  methods: {
    select () {
      this.$refs.file.click()
    },
    cancel () {
      this.status = 0
      this.ctxW = 0
      this.ctxH = 0
    },
    success (file, response, status, header) {
      if (response.url) {
        file.url = 'http://pic.qingting.fm/' + response.url
        this.isError = false
        this.status = 0
        this.updateURL(file.url)
      } else {
        this.isError = true
      }
    },
    refresh_token (file, response, status, header) {
      this.isError = true
    },
    retry () {
      this.isError = false
      this.submit()
    },
    checkType (file) {
      let type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1).toUpperCase() + '|'
      if ('|JPG|JPEG|PNG|BMP|'.indexOf(type) === -1) return false
      return true
    },
    checkSize (file) {
      return new Promise((resolve, reject) => {
        if (file.size > 512000) {
          reject(new Error('图片大小超过500K限制！'))
          return
        }
        let img = new window.Image()
        let reader = new window.FileReader()
        reader.onload = (event) => {
          img.src = event.target.result
        }
        reader.onerror = () => {
          reject(new Error('文件读取失败。'))
        }
        img.onload = () => {
          if (this.needCheckSize && (img.naturalWidth < this.width || img.naturalHeight < this.height)) {
            reject(new Error('图片长宽不符合要求。'))
          } else {
            resolve()
          }
        }
        img.onerror = () => {
          reject(new Error('图片文件无法加载到Image中。'))
        }
        reader.readAsDataURL(file)
      })
    },
    change () {
      var file = this.$refs.file.files[0]
      if (!this.checkType(file)) {
        this.$message.error('文件格式错误')
        return
      }
      this.checkSize(file).then(() => {
        this.isUploading = true
        this.submit()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err)
      })
    },
    submit () {
      var file = this.$refs.file.files[0]
      this.getUpyunToken()
        .then(formData => {
          this.options.formData = formData
          this.file = new FileItem(file, this.options)
          this.file.upload()
        })
    },
    updateURL (url) {
      this.$refs.file.value = ''
      this.urlStr = url
      this.$emit('updateURL', url)
      this.$emit('input', url)
    },
    getUpyunToken () {
      return api('upyun_token').fetch({})
        .then(resp => {
          if (resp && resp.data) {
            return resp.data
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('用户权限认证失败')
        })
    }
  }
}
</script>

<style lang='css' scoped>
input[type=file]{
  display: none;
}
img {
  display:inline-block;
  height: 150px;
  min-width: 150px;
}
</style>
