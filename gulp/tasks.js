/**
 * Created by my on 2016/11/19.
 */
var gulp = require("gulp");
var config = gulp.config;
var utils = require("./utils");
var dev_basis = require("./basis-dev");
var server = require("gulp-connect");
var initServer = require("./server");
// var server = null;
var order = require("gulp-order");
var url = require("url");
var path = require("path");
// var filter = require("gulp-filter");
var concat = require("gulp-concat");
var del = require("del");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
// utils.log(config.src, null, true);
// var server = require("./server");

/************************
 * 基本模快处理
 *
 ***********************/
gulp.task("dev-html", devHtml);
function devHtml() {
    // 考虑到性能的问题，html建议直接复制
    // moduleTask("html", "dev_html");
    utils.log(config.dist.html);
    return gulp.src(config.src.html, {base: "./src/modules"})
                .pipe(gulp.dest(config.dist.html));
}

gulp.task("dev-js", devJs);
function devJs() {
    return moduleTask("js", "dev_js");
}

gulp.task("dev-less", devLess);
function devLess() {
        return moduleTask("less", "dev_less");
}

gulp.task("dev-index", devIndex);
function devIndex() {
    return gulp.src('./src/modules/index/index.html')
        .pipe(gulp.dest(config.dist.base))
}

gulp.task("dev-res", devRes);
function devRes() {
    return dev_basis.dev_res();
}

gulp.task("dev-common", function () {
    return dev_common();
});
function dev_common(files, dest) {
    utils.log("dev common js");
    files = files || [config.src.common+"/**/*.js", config.src.common+"/*.js"];
    return gulp.src(files)
        .pipe(order([config.src.common+"/main.js", config.src.common+"/*.js", config.src.common+"/**/.js"], {base: '.'}))
        .pipe(concat("my.js"))
        .pipe(gulp.dest(config.dist.libs))
}

gulp.task("dev-libs", devLibs);

function devLibs() {
    return dev_basis.dev_libs();
}
/**
 * 根据任务类型执行对应的操作
 * 可考虑建立映射，以便扩展
 * @param type
 * @param fn
 */
function moduleTask(type, fn){
    var modules = config.args.modules || [];
    var _task = [];
    modules.forEach(function (module) {
        _task.push(dev_basis[fn](module));
    });

    Promise.all(_task)
        .then(function () {
            utils.log("dev "+ type+ " finished");
        })
}

/*************************
 * 以下部分为监听
 * 为控制性能，监听后只操作已修改的文件
 *
 *************************/
// 模块监听
gulp.task("watch:modules", function () {
    gulp.watch("src/modules/**", function (e) {
        var fileType = path.extname(e.path) || "";
        var _module = path.relative('./src/modules', e.path);
        var module = _module.split("\\")[0] || "";
        if(!fileType || !module){
            return utils.log("Not found the module");
        }
        utils.log(_module+"changed");

        switch (fileType){
            case '.js':{
                    dev_basis.dev_js(module);
                break;
            }
            case '.html':{
                // 特殊处理index.html
                if(module == "index" ){
                    devIndex();
                }else{
                    dev_basis.dev_html(module, false);
                }
                break;
            }
            case '.less':{

            }
            case '.css':{
                    dev_basis.dev_less(module)
                        .on('end', function () {
                            dev_basis.concat_css();

                        })
                break;
            }
        }
        server.reload();
    })
});
// 公用js 监听
gulp.task("watch:common", function (e) {
    var files = [config.src.common+"/*.js", config.src.common+"/**/*.js"];
    return gulp.watch(files, function (e) {
            utils.log(e.path +" changed");
            dev_common(files);
    })

});


// 需要进一步修正
gulp.task("watch:res", function (e) {
    var files = ["src/res/*.*", "src/res/**/*.*"];

    return gulp.watch(files, {base: './'}, function (e) {
       var filetype = path.extname(e.path) || "";
       utils.log(filetype);

       var relativePath = path.relative("./src/res", e.path);
       if(-1!= filetype.indexOf('.svg'))return;
       if(-1 != filetype.indexOf("less")){
           return dev_basis.dev_res(relativePath, 'less');
       }else if(-1 != ['.eot','.ttf','.woff'].indexOf(filetype)){
           return dev_basis.dev_res(relativePath, 'font');
       }else{
           return dev_basis.dev_res(relativePath, 'img');
       }

    })
});

/**
 *  打包前拷贝 www 目录至 app 下
 */
gulp.task("copy-www",  copyWWW);

function copyWWW() {
    // 因css 缘故，copy 将对css文件夹单独处理
    var folders = ["html",  "js", "libs"];
    var paths = [];
    var filepath = [config.dist.base+"/**/*"];
    var isCompress = process.argv.slice(0).indexOf('-p')>-1?true:false;

    var _excludeModules = config.build.excludeModules || [];

    if(_excludeModules || _excludeModules.length){
        _excludeModules.forEach(function (item) {
            var tmpHTML = "!"+config.dist.base+"/html/"+item+"/*";
            var tmpJS = "!"+config.dist.base+"/js/"+item+"main.js";
                filepath.push(tmpHTML, tmpJS);
        })
    }
    utils.log(filepath);



    // folders.forEach(function (item) {
    //     paths.push(config.dist.base+"/"+item+"/*");
    // });
    // paths.push(config.dist.base+"/css/style.css");
    // paths.push(config.dist.base+"/css/**/*.*");
    // paths.push(config.dist.base+"/index.html");

    return gulp.src(filepath)
    // return gulp.src(paths, {base: './www'})
        .pipe(gulpIf(checkIfCompress,  uglify()))
        .pipe(gulp.dest(config.app.www));

    function checkIfCompress(file) {
        return path.extname(file.path).indexOf('js')>-1 && isCompress;
    }

}

gulp.task('clean-www', cleanWWW);

gulp.task('clean-app', cleanApp);

function cleanWWW() {
    del(config.dist.base+"/**/*");
}

function cleanApp() {
    del(config.app.www + "/**/*");
}

gulp.task("start-server", function () {
    return initServer();
});

gulp.task("build-apk", function () {
    var build_apk = require("./build-apk");
    return build_apk.build();
});
