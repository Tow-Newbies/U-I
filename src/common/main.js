angular
    .module("myApp", [
    	"ngRoute",
		"ngAnimate",
		"common.myGlobal",
		"common.routes",
		"common.myLoader",
		"common.utils",
		"module.home"
    ])

    .run([
    	"$location",
    	"$rootScope",
    	"$q",
		"myGLOBAL",
        "$timeout",
    	function($location, $rootScope, $q, myGLOBAL, $timeout){

		console.log("myGLOBAL: " , myGLOBAL);

    	$location.path("/home");
    	//检查是否已经加载过模块
    	$rootScope.$on("$routeChangeStart", function(evt, next, cur){
    		var route = next && next.$$route;
    		if(!route){
				return $location.path("/home");
			}
    	});
        /*$rootScope.$on("$routeChangeStart", function(evt, next, cur){
            var excludeRoute = ["/home"];
            var route = next && next.$$route;
            if(!route )return;
            var url = next.$$route.originalPath;
            var ele = angular.element(document.querySelector("#footbar"));
            if(-1 == excludeRoute.indexOf(url)){

                ele.addClass("fadeOutDown");
                $timeout(function(){
                    ele.removeClass("fadeOutDown");
                    ele.css("display", "none");
                },100);
            }else{
                if(cur && excludeRoute.indexOf(cur.$$route.originalPath)!=-1){

                }else{
                    ele.css("display", "");
                    ele.addClass("fadeInUp");
                    $timeout(function(){
                        ele.removeClass("fadeOutDown");
                    },100);
                }
            }
        });*/

    }])
 
    .controller("mainCtrl",[
        "$scope",
        "$location",
        "$timeout",
		"myGLOBAL",
		"utils",
		"myLoader",
        function($scope, $location, $timeout, myGLOBAL, utils, myLoader){
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
				activeTab(view.tabs[0]);

				$timeout(function(){
					view.status.pageShow = true;
				});
				utils.notice("Hello Cordova");
				//加载百度地图
				loadMap();
				view.alerts = myGLOBAL.alerts;

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
				myLoader.loadJs(src)
					.then(function(){
						console.log("Map load success, 现在可以开始创建地图了");
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
		function($window, $rootScope, $location, $timeout){
			function link($scope, $ele, $attr){
				var _animateClass = ["fadeInUp", "fadeOutDown", "fadeInDown", "fadaOutUp"];
				var animateClass = $attr["isTop"]=="true"?_animateClass.slice(0,2):_animateClass.slice(2,2);
				var excludeRoute = ["/home", "/food"];
				var animateDurition = 500;
				var animateCommonClass = "bar-animate";

				$rootScope.$on("$routeChangeStart", function(evt, next, cur){
					var _nextRoute;
					var _curRoute;
					// 处理离开主页
					if(next && next.$$route && cur && cur.$$route){
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
					$ele.addClass(animateClass[0]);
					$ele.addClass(animateCommonClass);
					$timeout(function(){
						$ele.removeClass(animateClass[0]);
						$ele.removeClass(animateCommonClass);
						// $ele.css("display", "none");
						$ele.addClass("ng-hide");
					},1000)

				}
				
				function enter() {
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
					},1000)
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

