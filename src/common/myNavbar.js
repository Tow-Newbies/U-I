
/**
 * Created by my on 2016/10/21.
 */
angular
    .module("common.navbar", ["ngRoute"])
    .directive("myNavbar", [
        "navBarFactory",
        function (navBarFactory) {

            function link($scope, $ele, $attr) {
                $scope.nav = navBarFactory;
            }
            return{
                link: link,
                replace: true,
                templateUrl:"html/directivesTpls/myNavBar.html"
            }
        }
    ])
    //后续将实现私有方法进行隔离，以便防止篡改
    .factory("navBarFactory", [
        function () {
            var navBar = {
                // 后退
                title: "",
                goBack: goBack,
                setTitle: setTitle,
                navBtns:[],
                addBtn: addBtn,
                triggerBtn: triggerBtn,
                hide: hideNavBar,
                show: showNavBar,
                isHide: false,
                isHideBack: true
            };
            /**
             * 后退
             */
            function goBack() {
                return window.history.go(-1);
            }

            /**
             * 注册navBtn
             * @param btnOpts
             * 调用的时候应该返回一个实例
             * 故需要建立相应的service (service 将生成多个实例)
             *
             */
            function addBtn(btnOpts) {
                btnOpts.name = btnOpts.name || "";
                if(!btnOpts.id){
                    btnOpts.id = Date.now()+btnOpts.name;
                }
                navBar.navBtns.push(btnOpts.id);
                // 关系数组，方便使用对象的方式进行调用
                navBar.navBtns[btnOpts.id] = btnOpts;
            }

            /**
             *  根据btnId 触发相应的回调
             * @param btnId
             * @returns {*}
             */
            function triggerBtn(btnId) {
                var btn = navBar.navBtns[btnId];
                if(!btn || typeof btn != "function")return;

                return btn.actionFn.call();
            }

            /**
             *  隐藏相应的NavBar
             * @param btnId
             */
            function hideNavBar(){
                navBar.isHide = true;
                return;
            }

            /**
             *  显示隐藏的NavBar
             * @param btnId
             */
            function showNavBar() {
                navBar.isHide = false;
                return;
            }

            /**
             * 设置title
             * @param title
             */
            function setTitle(title) {
                navBar.title = title;
                return;
            }



            return  navBar;

        }
    ])
    .service("myNavBar", [
        "navBarFactory",
        "decoratorFunc",
        function (navBarFactory, decoratorFunc) {
            // 暴露的方法
            // addBtn 不同的实例调用发生不同的相应；
            // goBack 唯一方法，
            // setTitle 唯一方法

            // navBtn 基本属性
            var commonOpts = {
                hide: false,
                name: null,
                icon: ""
            };
            this.addBtn = function (opts) {
                opts = angular.extend({}, commonOpts, opts);
                console.log(opts);
                opts.name = opts.name || "";
                if(typeof opts.id == "undefined"){
                    opts.id = Date.now()+opts.name;
                }
                navBarFactory.addBtn.call(this, opts);
                return navBarFactory.navBtns[opts.id];
            };

            this.goBack = function () {
                return navBarFactory.goBack.call();
            };

            this.setTitle = function (title) {
                return navBarFactory.setTitle(title);
            }

            this.hide = function () {
                return navBarFactory.hide();
            }
        }
    ])


    // 底部导航栏或操作栏
    // 采用平均分布
    .directive("myBotBar", [
        "BotBarFactory",
        function (BotBarFactory) {

            function link($scope, $ele, $attr) {

            }

            return{
                link: link
            }
        }
    ])
    .factory("BotBarFactory",[
        function () {
            function BotBar() {

            }
            // 可以考虑复用navBarFactory 的部分代码
            var _proto = {
                actBtns: [],
                isHide: true,
                addBtn: function (btnOpts) {
                    btnOpts.name = btnOpts.name || "";
                    btnOpts.id = btnOpts.id || Date.now()+btnOpts.name;
                    this.actBtns.push(btnOpts.id);
                    this.actBtns[btnOpts.id] = btnOpts;
                    return btnOpts.id;
                },
                trigger: function (btnId) {
                    return this.actBtns[btnId] && this.actBtns[btnId].actionFn.call();
                },
                show: function () {
                    this.isHide = false;
                },
                hide: function () {
                    this.isHide = true;
                }
            };

            BotBar.prototype = _proto;
            BotBar.prototype.constructor = BotBar;

            return new BotBar();

        }

    ])
    .service("myBotBar", [
        "BotBarFactory",
        function (BotBarFactory) {

            this.addBtn = function (opts) {
                if(typeof opts.actionFn != "function"){
                    opts.actionFn = function () {};
                }
                var btnId = BotBarFactory.addBtn.call(null, opts);

                return BotBarFactory.actBtns[btnId];
            };

            this.hide = function () {
                return BotBarFactory.hide();
            };

            this.show = function () {
                return BotBarFactory.show;
            }
        }
    ])
;