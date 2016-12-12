#


#U&I `You and I`
####1、初始化工程
    1.1 从git 迁下工程
    git clone https://github.com/my9527/U-I.git
    1.2 进入工程
    cd U-I
    1.3 安装npm 插件
    npm install

    1.4 更新代码
    git fetch
    git rebase origin/master

####2、开发命令说明

    2.1、 初始化cordova 工程
    gulp app-init

    2.2、 浏览器调试
        gulp

    2.3、 生成apk
        gulp build

####3、提交格式说明
        命令          命令说明
        add             添加新文件
        modified        修改文件
        setup           初始化模块
        delete          删除文件
        fixed           修复bug
        修改module，common
        例 add( home ): 增加水平排版文件
          modified( common.main ): 增加Tab切换；
        修改其他文件
        例 modified( config.xml ): 增加AllowInlineMediaPlayback 配置；
####4、路由添加
        工程采用动态加载的方式，故路由需提前定义
        添加模块
        在src/common/route.js添加模块路由（注：模块名需路由名相同）