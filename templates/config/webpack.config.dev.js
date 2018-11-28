/**
 * @component webpack.config.dev.js
 * @description 开发环境
 * @time 2018/3/8
 * @author **
 */
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { entryPath, templPath, publicPath, jsRegex, cssRegex, imageRegex, fontRegex } = require('./webpack.config.variable.js');

module.exports = {
    mode: 'development',
    entry: {
        app: entryPath
    },
    output: {
        filename: "js/[name].[hash:16].js",
    },
    module: {
        rules: [
            {
                test: jsRegex,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                // test 表示测试什么文件类型
                test: cssRegex,
                // 使用 'style-loader','css-loader'
                use:[
                    {
                        loader: require.resolve('style-loader'),
                        options: {},
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {},
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ]
            },
            {
                test: imageRegex, 
                use:
                [{
                    loader: 'url-loader',
                    options: {
                        fallback: 'file-loader',
                        limit: 8192,
                        outputPath: 'static/images/',
                        name: '[name]_[hash:7].[ext]',
                    }
                }]
            },
            {
                test: fontRegex, 
                use:
                [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/fonts/',
                        name: '[name]_[hash:7].[ext]',
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: templPath,
            inject: 'body',
            minify: {
                html5: true
            },
            hash: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: '8080',
        contentBase: publicPath,
        compress: true,
        historyApiFallback: true,
        inline:true,
        hot: true,
        https: false,
        open: true,
        clientLogLevel: "error",
        //在控制台只显示错误信息
        stats: "errors-only",
        //通过这个配置可以在出错时 显示一个遮罩层
        //在这个遮罩层上 会将错误信息 打印出来
        overlay: {
            errors: true
        },
        proxy: {}
    }
};