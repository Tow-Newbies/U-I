angular
    .module("myApp", [
    	"ngRoute",
		"ngAnimate",
		"module.home",
		"common.myGlobal",
		"common.routes",
		"common.myLoader"
    ])

    .run([
    	"$location",
    	"$rootScope",
    	"$q",
		"myGLOBAL",
    	function($location, $rootScope, $q, myGLOBAL){

		console.log("myGLOBAL: " , myGLOBAL)
    	$location.path("/home");
    	//检查是否已经加载过模块
    	$rootScope.$on("$routeChangeStart", function(evt, next, cur){
    		var route = next && next.$$route;
    		if(!route){
				return $location.path("/home");
			}
    	});

    }])
 
    .controller("mainCtrl",[
        "$scope",
        "$location",
        "$timeout",
        function($scope, $location, $timeout){
            var view = this;

			init();
			function init(){
				view.tabs = [
					{
						id: 0,
						name: "home",
						icon: "fa fa-home",
						url: "#/home",
						func: activeTab,
						active: false
					},
					{
						id: 1,
						name: "food",
						icon: "fa fa-food",
						url: "#/food",
						func: activeTab,
						active: false
					},
					{
						id: 2,
						name: "map",
						icon: "fa fa-map",
						url: "#/map",
						func: activeTab,
						active: false
					}
				];
				activeTab(view.tabs[0]);
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

;

