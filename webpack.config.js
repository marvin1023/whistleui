var webpack = require('webpack');

module.exports = {
  entry:{
	  index: './js/index',
	  rules: './js/rules',
	  values: './js/values'
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js'
  },
  module: {
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