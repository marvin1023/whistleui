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
  module: {
	    preLoaders: [{
	      test: /\.js$/,
	      exclude: /node_modules/,
	      loader: 'jsxhint'
	    }],
	    loaders: [{
	      test: /\.js$/,
	      exclude: /node_modules/,
	      loader: 'react-hot!jsx-loader?harmony'
	    }, {
	      test: /\.css$/,
	      loader: 'style-loader!css-loader'
	    }]
	  },
  plugins: [new webpack.optimize.CommonsChunkPlugin('common.js')]
};