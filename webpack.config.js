var webpack = require('webpack');

module.exports = {
  entry:{
	  index: './index',
	  rules: './rules',
	  values: './values'
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js'
  },
  plugins: [new webpack.optimize.CommonsChunkPlugin('common.js')]
};