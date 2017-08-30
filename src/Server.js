import path from 'path'
import express from 'express'

var app = express()

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve pure static assets
app.use(express.static(__dirname))
app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8012
var uri = 'http://localhost:' + port

app.listen(port, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Server started. Listening on ', uri);
  }
})
