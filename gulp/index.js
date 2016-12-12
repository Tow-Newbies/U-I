/**
 * Created by my on 2016/11/19.
 */
var gulp = require("gulp");
var runSequence = require('gulp-sequence');
var through2 = require("through2");
var utils = require("./utils");



/**
 * 获取已添加模块
 */
gulp.task("get-modules", getModules);

function getModules(){
    var filePath = gulp.config.src.modules;

    return gulp.src(filePath)
        .pipe(through2.obj(function (file, enc, cb) {
            // 根据相对路径获取模块名，模块内部支持文件夹形式
            var filename = file.relative.split('\\');

            if(-1 == gulp.config.args.modules.indexOf(filename[0])){
                gulp.config.args.modules.push(filename[0]);
            }
            this.push(file);
            cb();
        }))
        .on("end", function () {
            // utils.log(gulp.config.args.modules.join("+"));
        })
}
require("./tasks");
// require("./test");

gulp.task("dev", runSequence('clean-www','get-modules', ['dev-js', 'dev-html', 'dev-less', 'dev-index', 'dev-common'], ['dev-res', 'dev-libs'],'start-server', ['watch:modules', 'watch:common', 'watch:res']))
gulp.task("build", runSequence('clean-www','clean-app', 'get-modules', ['dev-js', 'dev-html', 'dev-less', 'dev-index', 'dev-common'], ['dev-res', 'dev-libs'], 'copy-www', 'build-apk'));