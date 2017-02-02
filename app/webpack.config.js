const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    client: './client.js',
    master: './master.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web APIs',
      excludeChunks: ['master']
    }),
    new HtmlWebpackPlugin({
      title: 'Web APIs master',
      filename: '_master.html',
      excludeChunks: ['client']
    })
  ]
};
