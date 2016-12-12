/**
 * Created by my on 2016/11/19.
 */
var gulp = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var config = gulp.config;
var rename = require("gulp-rename");
var utils = require("./utils");
var gulpIf = require("gulp-if");
var path = require("path");
var server = require("./server");
var order = require("gulp-order");
var uglify = require("gulp-uglify");

var isCompress = process.argv.slice(0).indexOf('-p')>-1?true:false;

/**
 * 复制 html
 * 待优化，只处理改变的文件
 * @param module
 * @returns {*}
 */
function dev_html(module, isArray) {
    var opts = resolvePaths("html", module);
    utils.log(module);
    utils.log(opts.files);
    return gulp.src(opts.files, {base: './src/modules'})
            .pipe(gulp.dest(opts.dest));
}

/**
 * 编译并合并模块js
 * 合并后重命名为  {moduleName}.js, 以便动态加载以及监测；
 * @param module
 * @returns {*}
 */
function dev_js(module) {
    utils.log("dev "+module+ " js");
    var opts = resolvePaths("js", module);

    return gulp.src(opts.files)
            .pipe(concat(module+"main.js"))
            .pipe(gulp.dest(opts.dest))
            .on('end', function () {
                utils.log(module+" js finished");
            })
}

/**
 * 编译less/css
 * @param module
 * @returns {*}
 */
function dev_less(module) {
    var files = [];
        files.push(config.src.base+"/modules/"+module+"/**/*.{less,css}");
        files.push(config.src.base+"/modules/"+module+"/*.{less,css}");
    var dest = config.dist.base + "/css";

    return gulp.src(files)
                .pipe(less())
                .pipe(rename(module+".css"))
                .pipe(gulp.dest(dest));
}

/**
 * 处理res 文件
 * font,img,less分离处理
 * 以便后期img 压缩
 * @param file
 * @param type
 */
function dev_res(file, type) {
    var isWatch = !!file && !!type;

    var _res = [];
    if(isWatch){
        utils.log(type);
        var _filePath = path.join(config.src.res, file);
        utils.log(_filePath);
        "less"==type && _res.push(resLess(file));
        "font"==type && _res.push(copyFile(_filePath, type));
        "img" == type && _res.push(copyFile(_filePath, type));
        // "img" == type && _res.push(copyImg());
    }else{
        _res.push(resLess());
        _res.push(copyFile());

    }

    Promise.all(_res)
        .then(function () {
            utils.log("res finished");
            _res.length = 0;
        });

    function resLess(){
        return gulp.src(config.src.res+"/index.less")
            .pipe(less())
            .pipe(rename('res.css'))
            .pipe(gulp.dest(config.dist.css))
            .on("end", function () {
                concatCss();
            })
    }

    function copyFile(file, type) {
        file = file || ["./src/res/**/*.*", "./src/res/*.*","!./src/res/**/*.less", "!./src/res/*.less"];

        var d = config.dist.css;
        if(type){
            d += "/"+type;
        }
        return gulp.src(file)
            .pipe(gulp.dest(d))
    }

    /**
     * 拷贝图片
     * 暂未使用，若要进行图片压缩，可以使用；
     * @param file
     * @returns {*}
     */
    function copyImg(file){
        file = file || "./src/res/img/*.*";
        return gulp.src(file)
            .pipe(gulp.dest(config.dist.css+"/img"))
    }

}

function dev_libs() {
    // var files = [config.src.libs+"/**/*.js", config.src.libs+"/*.js"];
    var files = ["src/libs/**/*.js", "src/libs/*.js"];
    var dest = config.dist.libs;

    return gulp.src(files, {base: '.'})
        .pipe(order(["src/libs/angular.js", "src/libs/*.js"], {base:'.'}))
        .pipe(concat("myLibs.js"))
        .pipe(gulp.dest(dest));
}
/**
 * 处理文件源路径和目标路径
 * @param type
 * @param module
 * @returns {{files: Array, dest: string}}
 */
function resolvePaths(type, module){
    var files =  [];
    files.push(config.src.base+"/modules/"+module+"/**/*."+type);
    files.push(config.src.base+"/modules/"+module+"/*."+type);

    var dest = config.dist.base + "/"+type+"/";
    return{
        files: files,
        dest: dest
    }
}


/**
 *  合并css
 * @returns {*}
 */
function concatCss() {
    return gulp.src(["www/css/*.css", "!www/css/style.css"])
        .pipe(order(["www/css/res.css", "www/css/index.css", "www/css/*.css"], {base: '.'}))
        .pipe(concat("style.css"))
        .pipe(gulp.dest("./www/css/"))

}
module.exports = {
    dev_html: dev_html,
    dev_js: dev_js,
    dev_less: dev_less,
    dev_res: dev_res,
    dev_libs: dev_libs,
    concat_css: concatCss
}