const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

// webpack 配置
module.exports = [
    // 打包 Web Components 代码
    {
        mode: 'production',
        context: path.resolve(__dirname, '..'),
        node: {
            __dirname: true
        },

        entry: {
            app: ['../mobile/App.js']
        },

        output: {
            path: path.resolve(__dirname, '../../dist/mobile/bundle'),
            filename: '[name].bundle.js',
            publicPath: '../../dist',
        },

        // target: "node",

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
                        'sass-loader',
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

        resolve: {
            extensions: ['.js', '.jsx']
        },

        externals: {
            swiper: 'Swiper' // 这个轮播库要这样掉才行，不然iphone5会空白
        },

        plugins: [

            new webpack.ContextReplacementPlugin(
                /moment\/locale$/,
                /zh-cn/
            ),
        ]
    },

    {
        mode: 'production',
        context: path.resolve(__dirname, '..'),
        node: {
            __dirname: true
        },

        entry: {
            server: ['../mobile/ProductServer.js']
        },

        output: {
            path: path.resolve(__dirname, '../../dist/mobile/bundle'),
            filename: '[name].bundle.js',
            publicPath: '../../dist',
        },

        target: "node",

        module: {
            rules: [
                { // js|jsx rules
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader',
                    ]
                }, // end of js|jsx rules
            ]
        }, // end of module

        resolve: {
            extensions: ['.js', '.jsx']
        },

        externals: {
            swiper: 'Swiper' // 这个轮播库要这样掉才行，不然iphone5会空白
        },

        plugins: [
            new webpack.ContextReplacementPlugin(
                /moment\/locale$/,
                /zh-cn/
            ),
        ]
    },
]
