/**************************************
 * Created by Hertz on 2015年10月20日
 **************************************/
const path = require('path')
const webpack = require('webpack')
const config = require('../systemConfig')


// webpack 配置
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: {
    // 热加载写法
    app: ['webpack-hot-middleware/client', './manage/App.js']
  },

  output: {
    filename: '[name].bundle.js',

    // build时输出目录，不发布代码可以注释掉
    path: path.resolve(__dirname, 'build/pcweb'),

    // 开发模式(文档译为观察模式)下输出的文件路径
    // server.html里的js路径需与这里保持一致
    publicPath: '/pcweb/bundle',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    rules: [
      { // js|jsx rules
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      }, // end of js|jsx rules

      { // css rules
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }, // end of scss|sass rules

      { // css rules
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ]
      }, // end of css rules

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }]
      }
    ]
  }, // end of module
}
