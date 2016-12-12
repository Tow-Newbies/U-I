angular
    .module("module.home", [
        "ngRoute",
        "ngSanitize",
        "common.eventListener"
    ])
    // .config(["$routeProvider", function($routeProvider){
    // 	$routeProvider
    // 		.when("/home", {
    // 			controller: "homeCtrl",
    // 			controllerAs: "hc",
    // 			templateUrl: "html/home/main.html"
    // 		})
    // }])
    .controller("homeCtrl", [
        "$scope",
        "$sce",
        "$timeout",
        "myGLOBAL",
        "utils",
        "eventListener",
        "navBarFactory",
        "myNavBar",
        function ($scope, $sce, $timeout, myGLOBAL, utils, eventListener, navBar, myNavBar) {
            var view = this;

            init();

            view.open = function(url){
                myGLOBAL.open(url, null, function(){
                    utils.notice("努力开发中...");
                })
            };

            function init() {
                view.modules = [{
                    name: "地图",
                    url: "/map",
                    icon: 'my-icon-geo'
                },{
                    name: "计步器",
                    url: "/walkMate",
                    icon: 'my-icon-upload'
                },{
                    url: "/gallary",
                    name: "相册",
                    icon: "my-icon-graphic-detail"
                }];

                addEmptyModule(view.modules);

                view.bannerList = [
                    {
                        url: 'http://pic.4j4j.cn/upload/pic/20160421/7738daa141.jpg',
                        desc: '1'
                    },
                    {
                        url: 'http://pic.4j4j.cn/upload/pic/20160421/91d2478ef4.jpg',
                        desc: '2'
                    },
                    {
                        url: 'http://pic.4j4j.cn/upload/pic/20160518/11d601e0b3.jpg',
                        desc: '3'
                    }
                ];
                view.jigsawUrl = null;

                var a = myNavBar.addBtn({
                    id:"myNavBar",
                    icon: "my-icon-search",
                    actionFn: function () {
                        console.log("gaga, this is navBar actived")
                    }
                });
                var b = myNavBar.addBtn({
                    icon: "my-icon-talk",
                    actionFn: function () {
                        console.log("This is v-up");
                    }
                });

                $timeout(function () {
                    a.hide = true;
                }, 10000);
                // console.log(a.id);
                // a.actionFn();
            }

            view.showJigsaw = showJigsaw;
            function showJigsaw() {
                // view.jigsawUrl = view.bannerList[Math.floor(Math.random()*3)].url;
                console.log(view.jigsawUrl);
                eventListener.trigger("myJigsawViewshow")(view.bannerList[Math.floor(Math.random()*3)].url);
            }

            /**
             * 补充空白应用，保持UI 布局
             * @param modules
             */
            function addEmptyModule(modules){
                var emptyNum = modules.length%4;
                console.log("需添加："+(4-emptyNum));
                if(0 !== emptyNum){
                    var emptyModule = {
                        name: "",
                        url: "",
                        icon: ""
                    }
                    for(var i=0; i<4-emptyNum; i++){
                        modules.push(emptyModule)
                    }

                }
            }

        }
    ]);
