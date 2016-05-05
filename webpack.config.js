var path = require('path');
module.exports = {
  devtool: 'source-map',
  entry: './client/js/app',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {presets: ['es2015', 'stage-0']},
      exclude: /node_modules/
    }]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: 'app.js',
    path: '/'
  }
}
