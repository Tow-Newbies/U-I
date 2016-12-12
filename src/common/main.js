angular
    .module("myApp", [
    	"ngRoute",
		"ngCordova",
		"ngAnimate",
		"common.myGlobal",
		"common.routes",
		"common.myLoader",
		"common.eventListener",
		"common.myDirectives",
		"common.navbar",
		"common.utils",
		"common.http",
		"module.home"
    ])

    .run([
    	"$location",
    	"$rootScope",
    	"$q",
		"myGLOBAL",
        "$timeout",
		"utils",
		"navBarFactory",
    	function($location, $rootScope, $q, myGLOBAL, $timeout, utils, navBarFactory){

		console.log("myGLOBAL: " , myGLOBAL);
		var indexUrls = ["/home", "/food"];

			$location.path("/home");
    	//检查是否已经加载过模块
    	$rootScope.$on("$routeChangeStart", function(evt, next, cur){
    		var route = next && next.$$route;
    		if(!route){
				return $location.path("/home");
			}
    	});

		//处理返回按钮
        $rootScope.$on("$routeChangeStart", function(evt, next, cur){
        	console.log(next, cur);
            if(next && next.$$route){
				// navBarFactory.isHideBack = true;
				if(-1 == indexUrls.indexOf(next.$$route.originalPath)){
					navBarFactory.isHideBack = true;

				}else{
					navBarFactory.isHideBack = false;

				}
			}else{
				// navBarFactory.isHideBack = false;
			}
			navBarFactory.navBtns.length = 0;
			// var title =
			cur && navBarFactory.setTitle(cur.name|| "My Cordova")
        });
        //



    }])
 
    .controller("mainCtrl",[
        "$scope",
        "$location",
        "$timeout",
		"myGLOBAL",
		"utils",
		"myLoader",
		"eventListener",
		"myNavBar",
        function($scope, $location, $timeout, myGLOBAL, utils, myLoader
        	, eventListener, myNavBar){
            var view = this;

			init();
			function init(){

				view.status = {
					pageShow: false
				};
				view.tabs = [
					{
						id: 0,
						name: "home",
						icon: "my-icon-home",
						url: "#/home",
						func: activeTab,
						active: false
					},
					{
						id: 1,
						name: "food",
						icon: "my-icon-msg",
						url: "#/food",
						func: activeTab,
						active: false
					},
					{
						id: 2,
						name: "map",
						icon: "my-icon-eidt",
						url: "",
						func: activeTab,
						active: false
					}
				];

				// 基本设置，全局性
				view.setting = {
					blur: false
				};
				view.jigsaw = {
					url: null,
					text: null
				}
				activeTab(view.tabs[0]);

				myNavBar.setTitle("My Cordova");
				$timeout(function(){
					view.status.pageShow = true;
				});
				utils.notice("Hello Cordova");
				//加载百度地图
				loadMap();
				view.alerts = myGLOBAL.alerts;

				// 设置拼图显示
				// view.jigsawUrl = null;
				view.isShowJigsawView = !!view.jigsaw.url;
				eventListener.sub('myJigsawViewshow', JigsawViewshow, "myJigsawViewshow")
				function JigsawViewshow(picUrl, txt){
					view.isShowJigsawView = true;
					view.jigsaw.url = picUrl;
					view.jigsaw.text = txt;
				}

				// 设置navbar 是否显示隐藏
				// top 、 bottom
				view.hideBar= {
					top: false,
					bot: false
				};
				eventListener.sub('myHideAnimateBar', hideBarFunc, "myHideAnimateBar")
				function hideBarFunc(target) {
					target && (view.hideBar[target] = true);
				}

				// 设置ng-view 背景模糊；
				// 主要在 jigsaw 应用时
				eventListener.sub('myBlurViewBg', blurBg, "myBlurViewBg");
				function blurBg(blur) {
					view.setting.blur = blur || false;
				}
			}

			function activeTab(tab){
				if(!tab.url){
					return
				}
				view.curTab = tab;
				view.tabs.forEach(function(item, index){
					item.active = false;
					if(item.id == tab.id){
						item.active = true;
					}
				})

			}

			function loadMap(){
				// var src = 'http://webapi.amap.com/maps?v=1.3&key=d51757a95cbe947bed4517daefb2a52d';
				var src = 'http://api.map.baidu.com/getscript?v=2.0&ak=fnrBakIbsFYrSUtFrqHWa0ekABA6n3N0&services=&t=20160928173929';
                var convertJs = 'http://developer.baidu.com/map/jsdemo/demo/convertor.js';
				myLoader.loadJs(src)
					.then(function(){
                        myLoader.loadJs(convertJs);
						console.log("Map load success, 现在可以开始创建地图了");
					})


			}


            //getUserPos() && (getUserPos = function(){});

            function getUserPos(){
                baidu_location.getCurrentPosition(function(data){
                    var rslt = JSON.parse(data)
                    myGLOBAL.userInfo.pos = {
                        lng: rslt.lng,
                        lat: rslt.lat
                    }
                    // utils.notice("success");
                    $timeout(function () {
                        utils.notice("success");
                        utils.notice(data)
                    },4000)

                }, function(){
                    utils.notice("failed to get the position")
                })
            }




        }
    ])

	.animation(".app-animate", [
		"$timeout",
		"$route",
		function($timeout, $route){
			var
				flagStack = [""],
				isBack,

				// enterClass = ["slideInRight", "slideInLeft"],
				enterClass = ["fadeInRight", "fadeInLeft"],
				leaveClass = ["fadeOutLeft", "fadeOutRight"],

				animatedDuration = 500
				;

			return {

				enter: function(elem, done){
					var _currentFlag = $route.current.$$route.originalPath,
						className = enterClass[0]
						;

					isBack = false;

					if(flagStack.length > 2){

						if(_currentFlag === flagStack[flagStack.length - 2]){
							className = enterClass[1];
							isBack = true;
							flagStack.splice(flagStack.length - 1, 1);
						}else{
							flagStack.push(_currentFlag || "");
						}

					}else{
						flagStack.push(_currentFlag || "");
					}

					elem.addClass("animated");
					elem.addClass(className);

					$timeout(function(){
						done();
						elem.removeClass(className);
						elem.removeClass("animated");
					}, animatedDuration);
				},

				leave: function(elem, done){

					elem.addClass(isBack ? leaveClass[1] : leaveClass[0]);
					elem.addClass("animated");

					$timeout(function(){
						done();
					}, animatedDuration);
				}
			}
		}
	])
    /*.animation(".footbar-animate", [
        "$timeout",
        "$route",
         function($timeout, $route){
             var
                 flagStack = [""],
                 isBack,
                 excludeRoute = ["/home"],

                 // enterClass = ["slideInRight", "slideInLeft"],
                 enterClass = ["fadeInUp", "fadeInDown"],
                 leaveClass = ["fadeOutDown", "fadeOutUp"],

                 animatedDuration = 500
                 ;

             return{
                 enter: function(ele, done){
                     var _currentFlag = $route.current.$$route.originalPath;
                     var _nextFlag = $route.current.$$route.originalPath;
                     var className = enterClass[0];
                         if(-1 == excludeRoute.indexOf(_currentFlag)){
                             isBack = false;
                             elem.addClass("animated");
                             elem.addClass(className);

                             $timeout(function(){
                                 done();
                                 elem.removeClass(className);
                                 elem.removeClass("animated");
                             }, animatedDuration);
                         }

                 },
                 leave: function(ele, done){
                     elem.addClass(isBack ? leaveClass[1] : leaveClass[0]);
                     elem.addClass("animated");

                     $timeout(function(){
                         done();
                     }, animatedDuration);
                 }
             }
         }
    ])*/

	.directive("animateBar", [
		"$window",
		"$rootScope",
		"$location",
		"$timeout",
		"eventListener",
		"myGLOBAL",
		function($window, $rootScope, $location, $timeout, eventListener, myGLOBAL){
			function link($scope, $ele, $attr){
				var _animateClass = ["fadeInUp", "fadeOutDown", "fadeInDown", "fadaOutUp"];
				var animateClass = $attr["isTop"]=="true"?_animateClass.slice(0,2):_animateClass.slice(2,2);
				var excludeRoute = ["/home", "/food"];
				var animateDurition = 500;
				var animateCommonClass = "bar-animate";

				var barName = $attr["barName"];
				var hideBar = myGLOBAL.setting[barName];
				eventListener.sub('myHideAnimateBar', hideBarFunc, "myHideAnimateBar")
				function hideBarFunc(target) {
					console.log(target, barName);
					// 增加both 处理方案
					if(target == 'both' || barName == target){
						myGLOBAL.setting[barName] = hideBar = true;
						console.log("trigger enter")
						// enter();
					}
					// barName && barName == target && (myGLOBAL.setting[target] = hideBar = true);
				}

				// eventListener.sub('myHideAnimateBar', hideBarFunc, "myHideAnimateBar")
				// function hideBarFunc(target) {
				// 	if(target){
				// 		hideBar = true;
				// 	}
				// }

				$rootScope.$on("$routeChangeStart", function(evt, next, cur){
					var _nextRoute;
					var _curRoute;
					// return;
					// 处理离开主页
					if(hideBar && next && next.$$route && cur && cur.$$route){
						var isToMainView = -1 == excludeRoute.indexOf(next.$$route.originalPath);
						var isFromMainView = -1 == excludeRoute.indexOf(cur.$$route.originalPath);
					 	 !isToMainView && isFromMainView && enter();
						 isToMainView && !isFromMainView && leave();

					}
				});
				// 之后监听滚动
				 $rootScope.$on("scrollDown", enter);
				$rootScope.$on("scrollUp", leave);



				function leave() {
					console.log(myGLOBAL.setting[barName], barName)
					if(!myGLOBAL.setting[barName])return;
					console.log("up",Date.now())
					$ele.addClass(animateClass[0]);
					$ele.addClass(animateCommonClass);
					$ele.addClass("ng-hide");
					$timeout(function(){
						$ele.removeClass(animateClass[0]);
						$ele.removeClass(animateCommonClass);
						// $ele.css("display", "none");
						// $ele.addClass("ng-hide");
					},800)

				}
				
				function enter() {
					if(!myGLOBAL.setting[barName])return;
					console.log("down", Date.now())
					$ele.removeClass("ng-hide");
					// $ele.css("display", "");
					$ele.addClass(animateClass[1]);
					$ele.addClass(animateCommonClass);
					$timeout(function(){
						$ele.removeClass(animateClass[1]);
						$ele.removeClass(animateCommonClass);

					}, 800)
				}
			}

			return{
				scope:{
				 isToHide: "="
				},
				link: link
			}
		}
	])
	.directive("delayShow", [
		"$timeout",
		function ($timeout) {
			return{
				restrict:"AEC",
				link: function (scope, ele) {
					$timeout(function () {
						ele.removeClass("delay")
					},500)
				}
			}
		}
	])
	.directive("mySplash", [
		"$window",
		"$timeout",
		"$location",
		"utils",
		function($window, $timeout, $location, utils){
			var t = null;
			function link($scope, $ele){
				$timeout(function(){
					$ele.css("display", "none");
					utils.notice("Loading finished");
				}, 3000)
			}
			function compile(ele, attr){
				return function(){
					document.body.appendChild(ele[0]);
					// t = $timeout(function(){
					//
					//     document.body.removeChild(ele[0]);
					//     $timeout.cancel(t);
					//     t = null;
					// }, 3500);
					return{
						postlink: link
					}
				}

			}
			return {
				templateUrl: "html/splash/splash.html",
				link: link
				// compile: compile
			}

		}
	])

;

