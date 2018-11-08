const validateProjectName = require('validate-npm-package-name');
const commander = require('commander');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const inquirer = require('inquirer');

const packageJson = require('./package.json');
const questions = require('./lib/user-config.js');
const {getDevDependencies,getDependencies} = require('./lib/dependencies.js');

//获取项目名称
let projectName;
let root;

//接受项目参数
const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.arguments('<project-directory>')
	.usage(`${chalk.green('<project-directory>')} [options]`)
	.action(name => {
		projectName = name;
	})
	.allowUnknownOption()
	.parse(process.argv);



if(projectName === undefined) {
	//判断用户是否输入名称
	console.log(chalk.red('Please pass the project name while using create-react-app-cli!'));
	console.log(chalk.green('for example:'))
	console.log();
	console.log('   create-react-app-cli ' + chalk.yellow('<react-app-name>'));
}
else {
	//判断名称是否合法
	const validationResult = validateProjectName(projectName);
	if (!validationResult.validForNewPackages) {
		console.error(
			`Could not create a project called ${chalk.red(
				`"${projectName}"`
			)} because of npm naming restrictions:`
		);
		printValidationResults(validationResult.errors);
		printValidationResults(validationResult.warnings);
		process.exit(1);
	}else{
		//名字合法，向后执行
		
		//项目路径
		root = path.resolve(projectName);

		//创建项目入口函数
		main();
	}
}

/**
 * 主入口函数
 * @return {[type]} [description]
 */
function main(){
	console.log();
	//用户输入配置
	inquirer.prompt(questions).then(function (result) {

		//项目名称 默认为 projectName
		const name = result.baseConfig.name===''?projectName:result.baseConfig.name;
		//项目版本 默认为 1.0.0
		const version = result.baseConfig.version===''?'1.0.0':result.baseConfig.version;
		//项目描述 默认为空
		const description = result.baseConfig.description===''?'':result.baseConfig.description;
		//作者 默认为空
		const author = result.baseConfig.author===''?'':result.baseConfig.author;
		//许可证 默认为ISC
		const license = result.baseConfig.license===''?'ISC':result.baseConfig.license;
		//是否使用css预处理器 0为不使用 1为sass 2为less 3为stylus
		const usePreprocessCSS = result.baseConfig.CssPreprocess===''?'0':result.baseConfig.CssPreprocess;
		//创建项目文件夹
		makeDir();
		//复制模板文件
		copyTemplates();
		//创建package.json文件
		generatePackageJson(name,version,description,author,license);
		//安装相关npm包
		install();
	})
}
/**
 * 创建目录
 * @param  {[String]} path [创建目录的路径]
 * @return {[type]}      [description]
 */
function makeDir(){
	console.log();
	console.log(`Creating a new React app in ${chalk.green(root)}.`);
	fs.ensureDir(root,function(err){
		if(err){
			console.log(`Create dir failed : ${chalk.red(err)}`);
		}
	});
}
/**
 * [复制模板]
 * @return {[type]} [description]
 */
function copyTemplates() {
	try {
		if(!fs.existsSync(path.resolve(__dirname, './templates'))) {
			console.log(chalk.red('Cannot find the template files !'));
			process.exit(1);
		}
		fs.copySync(path.resolve(__dirname, './templates'), root);
		console.log();
		console.log(`Template files copied ${chalk.green('Successfully')}.`);
		return true;
	}
	catch(e) {
		console.log(chalk.red(`Error occured: ${e}`))
	}
}
/**
 * [生成package.json文件]
 * @return {[type]} [description]
 */
function generatePackageJson(name,version,description,author,license) {
	let packageJson = {
		name: name,
		version: version,
		description: description,
		scripts: {
			test: "echo \"Error: no test specified\" && exit 1",
			start:  "webpack-dev-server --config config/webpack.config.dev.js",
			build: "webpack --config config/webpack.config.prod.js"
		},
		author: author,
		license: license
	};
	try {
		fs.writeFileSync(
			path.resolve(root, 'package.json'), 
			JSON.stringify(packageJson, null, 2)
		);
		console.log();
		console.log(`Package.json generated ${chalk.green('Successfully')}.`);
	}
	catch(e) {
		console.log(chalk.red(e))
	}
}
/**
 * [安装依赖模块]
 * @return {[type]} [description]
 */
function install() {
	//使用npm时必须要改变路径
	process.chdir(root);

	console.log();
	console.log('Installing dependencies packages. This might take a couple of minutes.');
	console.log(`Installing ${chalk.cyan('react')} and ${chalk.cyan('react-dom')}.`);
	console.log();

	const child = spawn('npm', ['install', '-S', '--save-exact', '--loglevel', 'error'].concat(getDependencies()), {
		stdio: 'inherit'
	});
	
	child.on('close', function(code) {
		if(code !== 0) {
			console.log(chalk.red('Error occured while installing dependencies!'));
			process.exit(1);
		}
		else {
			console.log();
			console.log('Installing devDependencies packages. This might take a couple of minutes.');
			console.log(`Installing ${chalk.cyan('webpack')}, ${chalk.cyan('webpack-dev-server')} and ${chalk.cyan('babel-core')}...`);
			console.log()

			const child = spawn('npm', ['install', '-D', '--save-exact', '--loglevel', 'error'].concat(getDevDependencies()), {
				stdio: 'inherit'
			})
			child.on('close', function(code) {
				if(code !== 0) {
					console.log(chalk.red('Error occured while installing dependencies!'));
					process.exit(1);
				}
				else {
					console.log();
					console.log(`Success! Created app at ${root}`);
					console.log('Inside that directory, you can run several commands:')
					console.log();
					console.log(chalk.cyan('  npm run start'))
					console.log('    Starts the development server.');
					console.log();
					console.log(chalk.cyan('  npm run build'));
					console.log('    Bundles the app into static files for production.');
					console.log();
					console.log('We suggest that you begin by typing:')
					console.log();
					console.log(chalk.cyan(`  cd ${projectName}`));
					console.log(chalk.cyan('  npm run start'));
				}
			})
		}
	});
}
/**
 * [是否能用yarn安装]
 * @return {[type]} [description]
 */
function shouldUseYarn() {
  try {
	execSync('yarnpkg --version', { stdio: 'ignore' });
	return true;
  } catch (e) {
	return false;
  }
}
/**
 * [打印项目名称相关错误信息]
 * @param  {[string]} results [原因字符串]
 * @return {[type]}         [description]
 */
function printValidationResults(results) {
  if (typeof results !== 'undefined') {
	results.forEach(error => {
	  console.error(chalk.red(`  *  ${error}`));
	});
  }
}