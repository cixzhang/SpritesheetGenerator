module.exports = {
  entry: './src/build.jsx',
  output: {
    path: '.',
    filename: 'build/scripts.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react']
        }
      }
    ]
  }
};
