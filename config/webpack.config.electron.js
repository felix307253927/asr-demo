/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-13 17:22:32 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-13 17:22:32 
 */
'use strict';
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const path = require('path');

const publicPath = '/';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
  target: 'electron-main',
  entry: {
    electron: paths.electronIndex
  },
  output: {
    path: paths.appBuild,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: [
            ['env', { target: 'current' }]
          ]
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    /* new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }), */
  ],
  node: {
    global: true,
    process: true,
    Buffer: true,
    // __filename: true,
    // __dirname: true,
    __dirname: false,// 使用webpack打包后的 文件的__dirname
    __filename: false // 当为true， 使用未用webpack打包前的 文件__filename
  }
}