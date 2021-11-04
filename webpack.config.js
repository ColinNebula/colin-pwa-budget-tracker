// Import path
const path = require("path");
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
              loader: 'url-loader',
          }
        ]
      }
    ],
  },
  plugins: [
    new WebpackPwaManifest({
      name: 'Budget Tracker',
      short_name: 'Budget',
      description: 'An app that allows you to track your budget.',
      start_url: './src/index.html',
      background_color: '#01579b',
      theme_color: '#ffffff',
      fingerprints: false,
      inject: false,
      icons: [
        // {
        //   src: path.resolve('public/icons/icon-512x512.png'),
        //   sizes: [96, 128, 192, 256, 384, 512],
        //   destination: path.join('assets', 'icons')
        // }
      ]
    })
  ],
  entry: "./src/server.js",
  mode: 'development'
};

module.exports = config;