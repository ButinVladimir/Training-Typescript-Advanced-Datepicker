var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var path = require("path");

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: "build",
  },

  devtool: "source-map",

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".js", ".css", ".html"]
  },

  module: {
    preLoaders: [
      { test: /\.ts$/, loader: "tslint-loader" }
    ],

    loaders: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
    ],
  },

	plugins: [
	  new HtmlWebpackPlugin({
	    template: 'src/index.html'
	  }),
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ]
};