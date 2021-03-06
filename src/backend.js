/**
 * Server side api
 */
'use strict'
import UUID from 'node-uuid'
import winston from 'winston'
import passport from 'passport'
import { Router } from 'express'
import request from 'request'
import JWT from 'jsonwebtoken'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { CMS_HOST, DAL_HOST } from './config'
import crypto from 'crypto'
import { Buffer } from 'safe-buffer'
import moment from 'moment'
import md5 from 'blueimp-md5'
const bkendKey = process.env.ENDKEY
// Author defined params
const SECRET = process.env.SECRET || 'qt-saying'

const extractor = (req) => {
  if (req && req.cookies) {
    return req.cookies['jwt']
  }
}

const strategy = new Strategy({
  secretOrKey: UUID.v4(),
  jwtFromRequest: ExtractJwt.fromExtractors([extractor])
}, (jwtPayload, done) => {
  if (jwtPayload && jwtPayload.admin) {
    winston.info('jwt strategy info - admin: ', jwtPayload.sub)
    done(null, {
      id: jwtPayload.sub,
      admin: jwtPayload.admin
    })
  } else {
    done(null, false)
  }
})
passport.use(strategy)

const router = Router()
const verify = (username, password) => {
  return new Promise((resolve, reject) => {
    if (typeof username === 'string' && typeof password === 'string') {
      request.post(`${CMS_HOST}/v1/admin/login`, {
        form: { username, password }
      }, (err, response, body) => {
        if (err) {
          winston.error(err)
          return reject(err)
        } else {
          console.log(body)
          return resolve(body)
        }
      })
    }
  })
}

router.get('/jwt', (req, res) => {
  const { username, password } = req.query
  return verify(username, password)
    .then(result => {
      if (typeof result === 'string') {
        const data = JSON.parse(result)
        if (data.data && data.data.user_id) {
          const id = data.data.user_id
          const name = data.data.username
          const jwtToken = JWT.sign({
            sub: id,
            admin: true
          }, '4922aaae207ec67ed28cec90125035ed') // TODO: Move to env config
          return res.status(200).send({ data: {id, name, token: jwtToken}, errorno: 0, errormsg: '' })
        }
      }
      winston.error('CMS backend returned negative data')
      res.status(401).end()
    })
    .catch((err) => {
      winston.error(err)
      res.status(401).end()
    })
})

function upyunTokenGen (param) {
  let params = {
    bucket: 'qingting-pic',
    expiration: Math.floor(Date.now() / 1000 + 30 * 60),
    'save-key': 'community/{year}/{mon}/{day}/{filemd5}{.suffix}'
  }
  if (param) {
    params['x-gmkerl-thumb'] = param
  }
  let policy = Buffer.from(JSON.stringify(params)).toString('base64')
  let secret = 'jSWqvtH7XW57O0g3ZmkH1k4jKVQ='
  let md5Str = crypto.createHash('md5').update(policy + '&' + secret).digest('hex')
  params.policy = policy
  params.signature = md5Str
  return params
}

router.get('/upyun_token', (req, res) => {
  let data = upyunTokenGen()
  res.status(200).send({ data, errorno: 0, errormsg: '' })
})

router.get('/managers', (req, res) => {
  // TODO: Add pagination
  request.get(`${CMS_HOST}/v1/admin/user?pagesize=160`, (err, response, body) => {
    if (err) {
      winston.error(err)
      res.status(200).end()
    } else {
      console.log(body)
      res.status(200).json(JSON.parse(body))
    }
  })
})

router.get('/categories', (req, res) => {
  request.get(`${DAL_HOST}/categories?hierarchy_pid=12&status=99,95,0`, (err, response, body) => {
    if (err) {
      winston.error(err)
      res.status(200).end()
    } else {
      winston.log(body)
      res.status(200).json(JSON.parse(body))
    }
  })
})

router.get('/orderlist', (req, res) => {
  if (req.query && req.query.userId) {
    let userId = req.query.userId
    const dtstr = moment().format('YYYYMMDDHHmmss')
    const qtpSig = dtstr + '|' + md5(`${dtstr}|${bkendKey}`)
    console.log('bkendKey: ', bkendKey, dtstr, `${dtstr}|${bkendKey}`, qtpSig)
    let options = {
      method: 'GET',
      url: `https://adminpay.qingting.fm/api/admin/order?_page=1&_perPage=20&_sortDir=DESC&_sortField=_id&state=success&user_id=${userId}`,
      headers: {
        'qtp-sig': qtpSig
      }
    }
    console.log('debug options: ', options)
    let callback = (error, response, body) => {
      console.log('error: ', error, response.statusCode)
      console.log('body: ', body)
      if (!error && response.statusCode === 200) {
        var info = JSON.parse(body)
        console.log('qtp backend result: ', info)
        res.status(200).json({ data: info, errorno: 0 })
      } else {
        res.status(500).end('pay server connection error', error)
      }
    }
    request(options, callback)
  } else {
    res.status(400).end()
  }
})

export default router
