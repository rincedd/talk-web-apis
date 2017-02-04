const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    client: ['core-js/es6', './client.js'],
    master: ['core-js/es6', './master.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  devtool: 'cheap-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web APIs',
      excludeChunks: ['master']
    }),
    new HtmlWebpackPlugin({
      filename: '_master.html',
      template: './index.html',
      excludeChunks: ['client']
    })
  ]
};
