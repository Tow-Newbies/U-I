var config = {
	// angular cordova 依赖文件
	base: [
		"./src/libs/angular.js"
	],
	// 工程开发源文件
	src: {
		base: './src',
		modules: './src/modules/**/*.*',
		js: './src/**/*.js',
		html: './src/**/*.html',
		less: './src/**/*.{less,css}',
		libs: './src/libs/*.js',
		common: 'src/common',
		res: './src/res'
	},
	// cordova 工程文件
	dist: {
		base: './www',

		html: './www/html',
		js: './www/js',
		css: './www/css',
		libs: './www/libs'
	},
	app: {
		base: './app',
		www: './app/www'

	},

	args:{
		modules: []
	},
	// 调试服务器
	server: {
		port: 3000,
		root: './www'
		
	},
	// 打包时排出的模块
	build: {
		excludeModules: ['movies']
	},

	//cordova run android --release -- --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password
	keystore:{
		Keystore:"my-ui-key.jks",
		storePassword:"yl140523",
		alias:"app",
		password:"yl140523",
	}

};
module.exports = config;