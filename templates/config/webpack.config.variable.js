const path = require('path');
//root 根目录
const root = path.resolve(__dirname,'../');
//src 文件夹
const srcPath = path.resolve(root,'src');
//build 文件夹
const buildPath = path.resolve(root,'build');
//public 文件夹
const publicPath = path.resolve(root,'public');
//入口文件 index.js
const entryPath = path.resolve(srcPath,'index.js');
//html模板文件位置
const templPath = path.resolve(publicPath,'index.html');
//js 正则
const jsRegex = /\.(js|jsx)?$/;
//css 正则
const cssRegex = /\.css$/;
//image 正则
const imageRegex = /\.(png|svg|jpg|gif|jpeg)$/;
//font 正则
const fontRegex = /\.(woff|woff2|eot|ttf|otf)$/;
module.exports = {
    root,
    srcPath,
    buildPath,
    entryPath,
    publicPath,
    templPath,
    jsRegex,
    cssRegex,
    imageRegex,
    fontRegex
};