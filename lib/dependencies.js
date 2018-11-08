const getDevDependencies =  function(){
	let devDependencies = [
		'webpack-cli',
		'webpack@4',
		'webpack-dev-server@3',
		'html-webpack-plugin',
		'clean-webpack-plugin',
		'copy-webpack-plugin',
		'open-browser-webpack-plugin',
		'css-loader',
		'style-loader',
		'postcss-loader',
		'postcss-flexbugs-fixes',
		'autoprefixer',
		'mini-css-extract-plugin',
		'optimize-css-assets-webpack-plugin',
		'cssnano',
		'file-loader',
		'url-loader',
		'babel-loader@7',
		'babel-core@6',
		'babel-preset-es2015',
		'babel-preset-react', 
		'babel-preset-stage-0', 
	]
	return devDependencies;
}
const getDependencies =  function(){
	let dependencies = [
		'react',
		'react-dom'
	]
	return dependencies;
}
module.exports = {getDevDependencies,getDependencies};