const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

let webpackConfigs = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es2015', 'react', 'stage-0']
          }
        }
      },
      {
        test    : /\.css$/,
        exclude : /(node_modules|bower_components|dist)/,
        use : [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/utils', to: './utils' }
    ])
  ]
}

if (process.env.NODE_ENV === 'dev') {
  webpackConfigs.entry = './src/example/index.js'

  webpackConfigs.plugins.push(new HtmlWebpackPlugin({
    template: path.join(__dirname, "src/example/index.html"),
    filename: "./index.html"
  }))

  webpackConfigs.resolve = {
    extensions: [".js", ".jsx"]
  }

  webpackConfigs.devServer = {
    port: 3001
  }
} else {
  webpackConfigs.entry = './src/index.js'

  webpackConfigs.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  }

  webpackConfigs.externals = {
    'react': 'commonjs react'
  }
}

module.exports = webpackConfigs
