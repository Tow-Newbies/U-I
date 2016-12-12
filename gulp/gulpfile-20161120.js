/**
 * 构建工程
 */

var gulp = require("gulp"),
	through2 = require('through2'),
	runSequence = require('gulp-sequence'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	config = require('./config.js'),
	shell = require('shelljs'),
	changed = require('changed'),
	server = require('gulp-connect'),
	path = require("path"),
	url = require('url'),
	filter = require('gulp-filter'),
	del = require('del'),
	order = require('gulp-order')
	;

gulp.task("html", buildHtml);

gulp.task("less", buildLess);

gulp.task("js", function(){
	console.log("----------[ Attention ]: Start build js");
	var folders = config.args.modules;
	console.log("----------[ checked ]:"+folders.join("--"));
	console.log("----------[ checked ]: ./src/modules/"+folders[0]+"/*.js");
	// return
	buildjs(folders[0], folders);
	console.log('')
});

gulp.task('jsLibs', buildLibs);

gulp.task('copyFont',['copyImg'], copyFont);

gulp.task('copyImg', copyImg);
/**
 * 清理文件
 * @param  {[type]} ){	 gulp.src(config.dist.base+"*.*")				.pipe(del())				.pipe(gulp.dest(config.dist.base))} [description]
 * @return {[type]}      [description]
 */
gulp.task('clean',["clean:app"], function(){
	del(config.dist.base+"/**/*");
});

gulp.task('clean:app', function(){
	del(config.app.www + "/**/*");
})

/**
 * 构建首页
 */
gulp.task('buildHOME', buildHomeHTML);

/**
 * 构建模块
 * @param  {Array}  ){	var folderNames   [description]
 * @return {[type]}         [description]
 */
gulp.task('getModules', function(){
	var folderNames = [];
	console.log("----------[ Attention ]: Get modules names");
	// console.log(config.src)
	return gulp
			.src([config.src.modules])
			.pipe(through2.obj(function(file, enc, cb){
				var filename = file.relative.split('\\');
				console.log('=======>'+filename);
				if(-1 == config.args.modules.indexOf(filename[0])){
					config.args.modules.push(filename[0]);
				}
				this.push(file);
				cb();
			}))
			.on("end", function(){
				console.log("----------[ Attention ]: Get modules finished");
				console.log(config.args.modules)
			})
});
// 本地服务器
gulp.task("serve", function(){
	 server.server({
	    root: config.server.root,
	    port: config.server.port,
	    livereload: true
	  });
});


// 监测改动文件，执行相应的操作
// 
// 
gulp.task("watch:modules", function(){
	gulp.watch("src/modules/**", function(e){
		
		//获取文件类型
		var pathname = "";
		var fileType = path.extname(e.path) || "";
		var _moduleFile = path.relative('./src/modules', e.path);
		var changedModule = _moduleFile.split("\\")[0] || "";
		if(!changedModule){
			return
		}
		// console.log("----------[ Attention ]: "+_moduleFile+" changed");
		console.log("----------[ Attention ]: Start build "+changedModule);

		if(!fileType || !changedModule){
			return console.log("[ Attention ]: Not found the file");
		}

		switch(fileType){
			case '.js': {
					buildjs(changedModule, []);
				break;
			}
			case '.html': {
				if(changedModule === "index"){
					transferHTML(changedModule, _moduleFile)
				}else{
					buildHtml();
				}
				break;
			}
			case '.less': {
					buildLess();
				break;
			}
		}

		server.reload();
		// console.log()
	})
		
});


gulp.task("watch:common", function(){
	gulp.watch(config.src.common+"/*.js", function (e) {
		buildBaseMyLibs();
	})
});


gulp.task("watch:res", function () {
	gulp.watch(config.src.res+"/*.less", function (e) {
		buildLess();
	})
})
// 单独生成该模块的mainjs
// 然后合并成为 business.js
function buildjs(folder, folders){
	return	gulp.src(['./src/modules/'+folder+"/*.js", './src/modules/'+folder+"/**/*.js"])
			.pipe(concat(folder+"main.js"))
			.pipe(gulp.dest(config.dist.js))
			.on("end", function(){
				console.log("----------[ Attention ]: "+folder+" finished")
				if(folders.length){
					folders.shift();
					buildjs(folders[0], folders);
				}else{
					console.log("----------[ Attention ]: build js finished")
					// 生成bus.js 用于引用
					buildBussiness();

				}
			})
	}

function buildBussiness(){
	console.log("----------[ Attention ]: start buildBussiness");
	return gulp.src([config.dist.js+"/*main.js", "!"+config.dist.js+"/indexmain.js"])
			.pipe(concat("bus.js"))
			.pipe(gulp.dest(config.dist.js))

}

function buildHtml(){
	return gulp
			.src(config.src.html, {base: "./src/modules"})
			.pipe(gulp.dest(config.dist.html))
}

function buildLess(){
	console.log("This is buildLess");
	return gulp.src([config.src.less, config.src.res+"/index.less"])
				.pipe(less())
				.pipe(concat("style.css"))
				.pipe(gulp.dest(config.dist.css));
}

function copyFont(){
	return gulp.src("./src/res/font/*\.{ttf,woff,eot}")
		.pipe(gulp.dest(config.dist.css+"/fonts"))
}

function copyImg(){
	return gulp.src("./src/res/img/*.*")
		.pipe(gulp.dest(config.dist.css+"/img"))
}
function buildBaseLibs(){
	return gulp
				.src(config.src.base)
				.pipe(concat("baseJsLibs.js"))
				.pipe(gulp.dest(config.dist.libs))
}

function buildLibs(){
	// var files = (function(exclude){
	// 	var tmp = ["*"];
	// 	exclude.forEach(function(item){
	// 		tmp.push("!"+item);
	// 	});
	// 	return filter(tmp,{restore: true})
	// })(config.base);

	return gulp.src("./src/libs/*.js")
		.pipe(order(["src/libs/angular.js", "src/libs/*.js"], {base: '.'}))
		.pipe(concat("myLibs.js"))
		.pipe(gulp.dest(config.dist.libs))
}

function buildHomeHTML(){
	return gulp.src("./src/modules/index/index.html")
				.pipe(gulp.dest(config.dist.base))
}

function transferHTML(module, file){

	return gulp.src('./src/modules/index/index.html')
				.pipe(gulp.dest(config.dist.base))
}

// 打包cordova 工程
gulp.task("buildApp", function(){
	log("Start build APK ");
	var pwd = shell.pwd();
	var apk = "/app/platforms/android/build/outputs/apk";

	if(shell.cd(pwd + apk).code !== 0){
				log("请先添加platform");
				log("添加命令 gulp addPlatform");
				shell.exit(1)
	}

	shell.exec("start "+ path.normalize(pwd+apk))
	shell.cd("app");
	shell.exec("cordova build android");
	//start E:/my/cordova/app1/app1/platforms/android/build/outputs/apk
	
});

function log(msg){
	return console.log("---------[ Attention ]: " + msg);
}


gulp.task("createApp", createApp);
gulp.task("addPlatform", addPlatform);

// 初始化 cordova 工程
function createApp(){
	log("Init cordova project");
	shell.exec("cordova create app app.my.app app");
}
// 添加 Android 平台
function addPlatform(){
	log("Add Android platform");
	shell.cd("app");
	shell.exec("cordova platform add android");
}

// 替换 cordova应用图标
function replaceRes(){
	log("Delete Cordova res");
	var pwd = shell.pwd();
	var apk = "/app/platforms/android/res/drawable-land-*";
	// shell.exec("")
}

// 合并common 文件
gulp.task('buildBaseMyLibs', buildBaseMyLibs);

function buildBaseMyLibs(){
	log("build common js");
	return gulp.src("./"+config.src.common + "/*.js")
		.pipe(order([config.src.common+"/main.js", config.src.common+"/*.js"], {base: '.'}))
		.pipe(concat("my.js"))
		.pipe(gulp.dest(config.dist.libs))
}

// 拷贝www 目录至 app/www, 进行打包
gulp.task("copyWWW", copyWWW);

function copyWWW(){
	log("copy www to app folder");
	return gulp.src(config.dist.base+"/**/*")
				.pipe(gulp.dest(config.app.www))
}

// 初始化cordova 工程
gulp.task("init-app", runSequence('createApp', 'addPlatform'));
// 浏览器开发测试
gulp.task("default", runSequence('clean','getModules','js',['jsLibs', 'buildBaseMyLibs', 'less', 'html', 'buildHOME', 'copyFont'], ['watch:modules', 'watch:common', 'watch:res', 'serve']));
// 打包cordova 工程
gulp.task("build", runSequence('clean','getModules','js',['jsLibs', 'buildBaseMyLibs', 'less', 'html', 'buildHOME', 'copyFont'], 'copyWWW', 'buildApp'));