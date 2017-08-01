var etx = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var production = process.argv.indexOf('--production') !== -1;
var path = require("path");
var LiveReloadPlugin = require('webpack-livereload-plugin');
require('es6-promise').polyfill();

var plugins= [
	new etx("/[name].css", {}),
	new webpack.DefinePlugin({BOXURL: JSON.stringify(process.env.BOXURL)}),
	new LiveReloadPlugin({})
];
if (production){
	plugins.push( new webpack.optimize.UglifyJsPlugin({minimize: true, mangle: false}));
};
module.exports = {
  context: __dirname,
  entry: {
    "public": "./src/app.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "/[name].js"
  },
  module: {
    loaders: [
      { test: "\.js$", loader: "file-loader" },
      { test: /\.css$/,    loader: etx.extract("style-loader", "css-loader?minimize!") },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
	plugins: plugins,
  node: {
    fs: 'empty'
  },
  externals: [
  {
    './cptable': 'var cptable'
  }
  ],
  resolve: { extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee", ".less", ".css"]}
};
