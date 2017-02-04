const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    client: ['core-js/es6', './client.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, exclude: /node_modules/, loaders: ['style-loader', 'css-loader'] }
    ]
  },
  devtool: 'inline-sourcemap',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
