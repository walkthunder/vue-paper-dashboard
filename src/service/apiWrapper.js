import request from 'superagent'
import { trimEnd } from 'lodash'
import { getItem } from './storage'

const errors = {
  API_NO_UPDATE: 'API_NO_UPDATE',
  API_UNKNOWN: 'API_UNKNOWN',
  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  API_CONTENT_ERROR: 'API_CONTENT_ERROR'
}

const config = {
  API_REQUEST_TIMEOUT: 10000,
  LOCAL_STORAGE_VALID: true
}

const RETRY_DEFAULT = 3

function formatString (str, tags) {
  let query = '?'
  for (let attr in tags) {
    if (tags.hasOwnProperty(attr)) {
      if (attr === 's_T_A_T_I_C') {
        query = `/${encodeURIComponent(tags[attr])}${query}`
      } else {
        query += `${encodeURIComponent(attr)}=${encodeURIComponent(tags[attr])}&`
      }
    }
  }
  query = trimEnd(query, '&')
  return `${str}${query}`
}

function fetchWithRetry (url, params = {}, options = {}) {
  let retries = RETRY_DEFAULT
  let method = options.method || 'GET'
  let timeout = options.timeout || 1000
  if (options && options.retries) {
    retries = options.retries
  }

  return new Promise(function (resolve, reject) {
    let wrappedFetch = n => {
      const data = { ...options, method: null }
      delete (data.method)
      delete (data.params)
      let req = request(method, url).set(params)
      if (method === 'GET') {
        req = req.query(data)
      } else {
        req = req.send(data)
      }
      req
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          if (--n >= 0) {
            setTimeout(() => {
              wrappedFetch(n)
            }, timeout)
          } else {
            // todo request fail with retry logger
            reject(error)
          }
        })
    }
    wrappedFetch(retries)
  })
}

class API {
  constructor (entries) {
    this.entries = entries
    return key => {
      this.config = this.entries[key]
      this.key = key
      return this
    }
  }
  _getCacheKey (tags) {
    if (tags === undefined || tags === null || tags.length === 0) {
      return this.key
    }
    return `${this.key}_${tags.join('_')}`
  }
  fetchFromCache (tags = []) {
    return getItem(this._getCacheKey(tags))
  }

  fetch (tags = {}, options = {}) {
    if (this.config === undefined) {
      console.info('Unknown API: ', this.key)
      return Promise.reject(errors.API_UNKNOWN)
    }
    options.method = this.config.method || 'GET'
    let host = this.config.host || ''
    let apiPath = host + formatString(this.config.path, tags)
    return new Promise((resolve, reject) => {
      // for timeout
      let p = Promise.race([
        fetchWithRetry(apiPath, options.params, options),
        new Promise((resolve, reject) => {
          setTimeout(
            () => reject(errors.API_REQUEST_FAILED),
            config.API_REQUEST_TIMEOUT)
        })
      ])
      p.then((resp) => {  // timeout not expired
        if (resp.ok) {  // check http response code
          let retData = resp.body
          let errorNo = retData.errorno
          let errorMsg = retData.msg
          if (typeof errorNo === 'undefined') {
            errorNo = retData.errcode
          }
          if (typeof errorNo === 'undefined') {
            errorNo = retData.code
          }
          if (errorNo === 200 && errorMsg === 'success') {
            return resolve(retData)
          }
          if (errorNo !== 0) {
            return reject(errors.API_REQUEST_FAILED)
          }
          let newData = retData.data || retData.Data
          if (!newData) {
            reject(retData)
          }
          resolve({data: newData, tags})
        } else {
          reject(errors.API_REQUEST_FAILED)
        }
      })
        .catch((reason) => {
          console.error(apiPath, reason)
          reject(errors.API_REQUEST_FAILED)
        })
    })
  }
}

export default API
