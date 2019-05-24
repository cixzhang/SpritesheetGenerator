const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/build.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'scripts.js'
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        use: 'babel-loader',
      }
    ]
  }
};
