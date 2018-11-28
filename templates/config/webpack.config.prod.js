/**
 * @component webpack.prod.js
 * @description 生产环境
 * @time 2018/3/8
 * @author **
 */
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // copy
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const { root, entryPath, buildPath, templPath, publicPath, jsRegex, cssRegex, imageRegex, fontRegex } = require('./webpack.config.variable.js');

module.exports = {
    mode: 'production',
    entry: {
        main: entryPath
    },
    output: {
        filename: "static/js/[name].[chunkhash:16].js",
        path: buildPath
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
                    MiniCssExtractPlugin.loader,
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
                use:[
                    {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader',
                            limit: 8192,
                            outputPath: 'static/images/',
                            name: '[name]_[hash:7].[ext]',
                        }
                    }
                ]
            },
            {
                test: fontRegex, 
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/fonts/',
                            name: '[name]_[hash:7].[ext]',
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            //压缩js
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                }
            }),
            //压缩css
            new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
        ]
    },
    plugins: [
        //删除build文件夹
        new CleanWebpackPlugin(['build'],{
            root: root, //指定根目录
            verbose: false,
            dry: false
        }),
        //将public文件夹下的内容都复制到build下
        new CopyWebpackPlugin([{
            from: publicPath,
            to: "",
            force: true
        }]),
        //根据模板自动添加 link script
        new HtmlWebpackPlugin({
            template: templPath,
            inject: 'body',
            minify: {
                html5: true
            },
            hash: false
        }),
        //分离css
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "static/css/[name].[chunkhash:16].css",
        })
    ],
    stats: {
        // 添加 compilation 的哈希值
        hash: false,

        // 添加 webpack 版本信息
        version: false,
        
        // 添加时间信息
        timings: false,

        // 添加构建日期和构建时间信息
        builtAt: false,

        // 添加资源信息
        assets:true,

        // 添加 children 信息
        children: false,

        // 通过对应的 bundle 显示入口起点
        entrypoints: false,

        // 添加构建模块信息
        modules: false,
    }
};