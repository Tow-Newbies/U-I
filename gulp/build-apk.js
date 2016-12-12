/**
 * Created by my on 2016/11/20.
 */
var gulp = require("gulp");
var shell = require("shelljs");
var utils = require("./utils");
var path = require("path");

// apk 生成后的文件路径
var apk = "/app/platforms/android/build/outputs/apk";
// 当前操作路径
var pwd = shell.pwd();
/**
 * 初始化cordova 工程
 */
function initCordova(){
    utils.log("init app");
    shell.exec("cordova create app app.my.app app");
}

/**
 * 添加android 平台
 */
function addPlatform(){
    utils.log("add android platform");
    shell.cd("app");
    shell.exec("cordova platform add android");
}

/**
 * 打包 apk
 */
function buildApk(){
    utils.log("Start build APK");
    if(shell.cd(pwd + apk).code !== 0){
        utils.log("请先添加platform");
        utils.log("添加命令 gulp addPlatform");
        shell.exit(1)
    }

    // 打开apk所在位置
    shell.exec("start "+ path.normalize(pwd+apk));

    shell.cd("app");
    shell.exec("cordova build android");

}


function openApkFile(){
    shell.exec("start "+ path.normalize(pwd+apk));
}

module.exports = {
    init: initCordova,
    addPlatform: addPlatform,
    build: buildApk
}


