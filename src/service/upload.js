/*!
 * @param {String:url} ［上传图片地址］
 * @param {file:File} [文件]
 * @param {onProgressUpload:events} [回调函数:onProgressUpload,onCompleteUpload,onErrorUpload,onSuccessUpload,onAbortUpload,onAddFileFail,onAddFileSuccess]
 * @param {onProgressUpload:events} [回调函数:onProgressUpload,onCompleteUpload,onErrorUpload,onSuccessUpload,onAbortUpload,onAddFileFail,onAddFileSuccess]
 * @param {onProgressUpload:events} [回调函数:onProgressUpload,onCompleteUpload,onErrorUpload,onSuccessUpload,onAbortUpload,onAddFileFail,onAddFileSuccess]
 */
class FileUploader {
  constructor (options) {
    Object.assign(this, {
      method: options.method || 'POST',
      name: options.name || 'file',
      url: options.url,
      formData: options.formData || {},
      headers: options.headers || {},
      withCredentials: options.withCredentials || false,
      responseType: options.responseType || 'json'
    })
    this.onProgressUpload = options.process
    this.onBeforeUpload = options.before
    this.onSuccessUpload = options.success
    this.onErrorUpload = options.error
    this.onCompleteUpload = options.end
  }
  upload (fileItem) {
    try {
      this._xhrPost(fileItem)
    } catch (e) {
      throw e
    }
  }
  cancel (fileItem) {
    try {
      if (fileItem._xhr) fileItem._xhr.abort()
    } catch (e) {
      console.log('abort')
    }
  }
  _onAbortUpload (fileItem, response, status, headers) {
    if (this.onAbortUpload) {
      this.onAbortUpload(fileItem, response, status, headers)
    }
  }
  _onProgressUpload (fileItem, progress) {
    fileItem.progress = progress
    if (this.onProgressUpload) {
      this.onProgressUpload(fileItem, progress)
    }
  }
  _onBeforeUpload (fileItem) {
    fileItem.progress = 0
    fileItem.isUploading = true
    fileItem.isCompelted = false
    if (this.onBeforeUpload) {
      this.onBeforeUpload(fileItem)
    }
  }
  _onSuccessUpload (fileItem, response, status, headers) {
    fileItem.isSuccess = true
    fileItem.isError = false
    if (this.onSuccessUpload) {
      this.onSuccessUpload(fileItem, response, status, headers)
    }
  }
  _onErrorUpload (fileItem, response, status, headers) {
    fileItem.isSuccess = false
    fileItem.isError = true
    if (this.onErrorUpload) {
      this.onErrorUpload(fileItem, response, status, headers)
    }
  }
  _onCompleteUpload (fileItem, response, status, headers) {
    fileItem.isUploading = false
    fileItem.isCompelted = true
    fileItem.progress = 100
    if (this.onCompleteUpload) {
      this.onCompleteUpload(fileItem, response, status, headers)
    }
  }
  /**
   * [_parseHeaders 头部信息转json格式]
   * @param  {[type]} headers [description]
   * @return {[type]}         [description]
   */
  _parseHeaders (headers) {
    var json = {}
    headers.split('\n').forEach((header) => {
      let index = header.indexOf(':')
      if (index > -1) {
        let key = header.slice(0, index).trim()
        let val = header.slice(index + 1).trim()
        json[key] = json[key] ? json[key] + ',' + val : val
      }
    })
    return json
  }
  /**
   * [_xhrPost 支持html5特性]
   * 可以直接使用formdata，配合xmlhttprequest上传任意文件
   * @param  {[type]} file [description]
   * @return {[type]}      [description]
   */
  _xhrPost (fileItem) {
    var uploader = this
    var xhr = new window.XMLHttpRequest()
    fileItem._xhr = xhr
    var postData = new window.FormData()
    uploader._onBeforeUpload(fileItem)
    for (let key in uploader.formData) {
      postData.append(key, uploader.formData[key])
    }
    postData.append(uploader.name, fileItem.file, fileItem.name)
    xhr.open(uploader.method, uploader.url, true)
    for (let key in uploader.headers) {
      xhr.setRequestHeader(key, uploader.headers[key])
    }
    xhr.upload.onprogress = (event) => {
      var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0)
      uploader._onProgressUpload(fileItem, progress)
    }
    xhr.onload = () => {
      var headers = uploader._parseHeaders(xhr.getAllResponseHeaders())
      var response = xhr.response
      var action = xhr.status === 200 ? 'Success' : 'Error'
      var method = '_on' + action + 'Upload'
      uploader[method](fileItem, response, xhr.status, headers)
      uploader._onCompleteUpload(fileItem, response, xhr.status, headers)
    }
    xhr.onerror = () => {
      var headers = uploader._parseHeaders(xhr.getAllResponseHeaders())
      var response = xhr.response
      uploader._onErrorUpload(fileItem, response, xhr.status, headers)
      uploader._onCompleteUpload(fileItem, response, xhr.status, headers)
    }
    xhr.onabort = () => {
      var headers = uploader._parseHeaders(xhr.getAllResponseHeaders())
      var response = xhr.response
      uploader._onAbortUpload(fileItem, response, xhr.status, headers)
      uploader._onCompleteUpload(fileItem, response, xhr.status, headers)
    }
    xhr.responseType = uploader.responseType
    xhr.withCredentials = uploader.withCredentials
    xhr.send(postData)
  }
}

export default class FileItem {
  constructor (file, options) {
    Object.assign(this, {
      uploader: new FileUploader(options),
      file: file,
      title: file.name.slice(0, file.name.lastIndexOf('.')),
      name: file.name,
      progress: 0,
      isSuccess: false,
      isError: false,
      isUploading: false,
      isCompelted: false,
      url: ''
    }, options.fileAttr || {})
  }
  _init () {
    this.isSuccess = false
    this.isError = false
    this.isUploading = false
    this.isCompelted = false
    this.progress = 0
  }
  _hash (str) {
    var hash = 0
    if (str.length === 0) return hash
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }
  upload () {
    this._init()
    this.uploader.upload(this)
  }
  cancel () {
    this.uploader.cancel(this)
  }
}
