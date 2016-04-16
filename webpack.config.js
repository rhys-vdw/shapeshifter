var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  '__DEBUG__': JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
});

module.exports =  {
  entry: "./src/index.js",
  output: {
      path: __dirname,
      filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: require('./.babelrc.json')
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  debug: true,
  devtool: 'source-map',
  eslint: {
    failOnWarning: false
  },
  plugins: [definePlugin]
}
