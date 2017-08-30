var path = require('path')
var webpack = require('webpack')
var webpackConfig = {
  context: path.join(__dirname, '../dist'),
  entry: {
    babel: 'babel-polyfill',
    server: path.join(__dirname, '../src/Server.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist')
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {'process.env.BROWSER': false })),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'stage-2'] },
        }],
      },

      // Loaders for other file types can go here
    ],
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
}

module.exports = webpackConfig
