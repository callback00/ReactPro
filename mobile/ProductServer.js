const http = require('http')
const path = require('path')
const express = require('express')
const app = express()

// 发布生产环境是使用

const port = 8099

/**
 * 用于指定URL路径和服务器路径的映射
 */
const publicDir = path.resolve(__dirname, './public')
app.use('/', express.static(publicDir))


app.use(function (req, res) {
    res.sendFile('Server.html', { root: __dirname })
})

app.listen(port, function () {
    console.log(`manage web listening on http://localhost:${port} \n`);
});
