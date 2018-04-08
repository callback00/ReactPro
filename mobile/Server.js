const http = require('http')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const systemConfig = require('../config/systemConfig')


const app = express()
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require('../config/webpack/webpack.config.mobile.js');
const compiler = webpack(config);

const port = systemConfig.mobilePort || 3000


/**
 * 用于指定URL路径和服务器路径的映射
 */
const publicDir = path.resolve(__dirname, './public')
app.use('/', express.static(publicDir))


app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use(function (req, res) {
  res.sendFile('Server.html', { root: __dirname })
})

app.listen(port, function () {
  console.log(`manage web listening on http://localhost:${port} \n`);
});
