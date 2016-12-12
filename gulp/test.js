/**
 * Created by my on 2016/11/20.
 */
var gulp = require("gulp");
var utils = require("./utils");
var config = gulp.config;
var runSequence = require('gulp-sequence');


/**
 * 执行命令格式
 * gulp test --task  task(待执行的任务)
 *
 * 已有任务
 *
 * ********  编译  *******
 * dev-less    编译less/css
 * dev-html    复制html
 * dev-js      编译、合并 模块js
 * dev-res     处理 res 文件（编译less， 拷贝字体、图片）
 * dev-common  编译、合并common ，生成 my.js
 * dev-libs    编译、合并libs， 生成 myLibs.js
 *
 * ********  清理 ********
 * clean-www    清除 www 目录（测试服务器目录）
 * clean-app    清除 app/www 目录
 *
 * ********  监测 ********
 * watch:common 监测 common目录
 * watch:modules监测 modules 目录
 * watch:libs   监测 libs 目录
 * watch:res    监测 res 目录
 *
 * ******** 打包 *********
 * init-cordova  初始化cordova 工程
 * copy-www      拷贝www 至cordova工程
 * build         打包apk（默认android）
 * add-platform  添加平台（默认android）
 * ******** 待扩展 ********
 * add-plugins  添加插件
 *
 *
 * @type {any}
 */

var args = process.argv.slice(3);
var task = [];
var tasks = [];


-1 !== args.indexOf('test') && init();

function init() {


// var mode = args[0];
    if(-1 !== args.indexOf('test'))return;
    task = args[1].replace(/\-\-/g,"");
    utils.log(args);
    utils.log('mission: '+" gulp "+task);


    // 可以只执行clean 任务，
    -1 == task.indexOf("clean") && tasks.push("clean-www");
    tasks.push("get-modules");
    tasks.push(task);
}
/**
 * 测试用
 * 由于是基于模块的构建，所以需依赖 get-modules
 */

gulp.task("test", runSequence.apply(runSequence, tasks));

//