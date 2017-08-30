process.env.NODE_ENV = 'production'

var ora = require('ora')
var chalk = require('chalk')
var webpack = require('webpack')
var srvConfig = require('./webpack.srv.conf')

var spinner = ora('building srv for production...')
spinner.start()

webpack(srvConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  console.log(chalk.green('  Build server complete.\n'))
})
