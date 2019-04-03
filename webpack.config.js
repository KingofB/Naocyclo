var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './js/App.js',
     output: {
     
         filename: 'app.bundle.js'
     },
     module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
},
     stats: {
         colors: true
     },
     devtool: 'eval-source-map'
 };