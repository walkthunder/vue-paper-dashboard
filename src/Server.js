import path from 'path'
import http from 'http'
import express from 'express'
import winston from 'winston'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import api from './backend'
import u2 from './u2'

var app = express()

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.use('/api', api)
app.use('/u2', u2)

// serve pure static assets
app.use(express.static(__dirname))
app.use('*', function (req, res) {
  console.log('no route hit for', req.originalUrl)
  res.sendFile(path.join(__dirname, '/index.html'))
})

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8012

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  winston.error(err, {originalUrl: req.originalUrl})
  res.status(err.status || 500).end()
})

var server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      winston.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      winston.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  winston.info('App started. Listening on %s', bind)
}
