/**
 * @component webpack.dev.js
 * @description 开发环境
 * @time 2018/3/8
 * @author **
 */
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: "js/[name].[hash:16].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                // test 表示测试什么文件类型
                test:/\.css$/,
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
                test: /\.(png|svg|jpg|gif|jpeg)$/, use:
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
                test: /\.(woff|woff2|eot|ttf|otf)$/, use:
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
            template: 'public/index.html',
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
        contentBase: path.join(__dirname, '../public'),
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