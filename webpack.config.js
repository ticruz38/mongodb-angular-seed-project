var path = require('path');
module.exports = {
  devtool: 'source-map',
  entry: ['./client/js/app'],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {presets: ['es2015', 'stage-0']},
      exclude: /node_modules/
    }, {
      test: /\.(scss|sass|css)$/,
      loader: 'style!css!sass'
    }, {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)$/i,
        loader: 'file'
    }]
  },
  output: {
    filename: 'app.js',
    path: '/',
    publicPath: 'http://localhost:3000/'
  }
}
