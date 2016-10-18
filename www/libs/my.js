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


/**
 * Created by my on 2016/10/18.
 */
angular
    .module("common.myGlobal", [])
    .factory("myGLOBAL", [
        function () {
            var myGLOBAL = {
                modules: ["home"]
            };

            return myGLOBAL;

        }
    ])
;

angular
	.module("common.http", [])
	.service("myHttp", [
		"$window",
		function($window) {


			var http = {
				init: function () {
					return this;
				},
				xhr: createXhr(),
				post: function () {

				},
				get: function (data, url, prefix) {
					var self = this;
					//转换
					var toPostData = JSON.stringify(data);
					toPostData = toPostData.replace(/[\{\}\'\"]/g, "").replace(/\:/g, "=").replace(/\,/g, "&")

					var defer = new Promise(function (resolve, reject) {
						self.xhr.open('get', (prefix || "") + url + "?" + toPostData, true);
						self.xhr.onreadystatechange = function (res) {
							if (('4' == self.xhr.readyState && '200' == self.xhr.status) || '304' == self.xhr.status) {
								console.log(self.xhr.responseText);
								resolve(res);
							} else {
								reject(res);
							}
						}
						self.xhr.send(null);
					});

					return defer;

				},
				jsonp: function () {

				}
			}

			/**
			 * 生成xhr，并复写createXhr
			 * @return {[type]} [description]
			 */
			function createXhr() {
				console.log("createXhr")
				if (window.XMLHttpRequest) {
					createXhr = function () {
						return new XMLHttpRequest();
					};
					return new XMLHttpRequest();
				} else {
					var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
					for (var i = 0, len = IEXHRVers.length; i < len; i++) {
						try {
							xhr = new ActiveXObject(IEXHRVers[i]);
							if (xhr) {
								createXhr = function () {
									return new ActiveXObject(IEXHRVers[i]);
								}
								return xhr;
							}
						} catch (e) {
							continue;
						}
					}
				}
			}

			this.get = http.get;
			this.jsonp = http.jsonp;
			this.post = http.post;

		}
	])


 
/**
 * Created by my on 2016/10/18.
 */
 var app = angular.module("common.myLoader", ["ngRoute"])
app.config(function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {

            app.controllerProvider = $controllerProvider;
            app.compileProvider    = $compileProvider;
            app.routeProvider      = $routeProvider;
            app.filterProvider     = $filterProvider;
            app.provide            = $provide;
            console.log(app)

            // Register routes with the $routeProvider
    })
    .config([
        "$routeProvider",
        "ROUTES",
        function ($routeProvider, ROUTES) {
            console.log(ROUTES);
            var routes = (function(){
                // 定义一个闭包变量用于保存已经加载的路由
                var routes = ["home"];
                return  routes;
            })();

            ROUTES.forEach(function(item, index){
                console.log(item)
                $routeProvider
                    .when(item.url, {
                        controller: item.ctrl,
                        controllerAs: item.ctrlAs,
                        templateUrl: item.tmp,
                        resolve: {
                            // console.log("This is resolve")
                            loadModule: ["$q","$timeout", "$rootScope", function($q, $timeout, $rootScope){
                                var d = $q.defer();
                                if(routes.indexOf(item.name) != -1){
                                    d.resolve();
                                    return d.promise;
                                }
                                loadModules(item.name, $timeout, $q)
                                    .then(function(){
                                        routes.push(item.name);
                                        d.resolve();
                                    });

                                return d.promise;

                            }]
                        }
                    })
            });



            function loadModules(module, $timeout, $q){
                var defer = $q.defer();
                console.log("load module: "+module)
                var script = document.createElement('script');
                script.src = "js/"+module+"main.js";

                document.body.appendChild(script);

                script.onload = function(){
                    defer.resolve();
                    $timeout(function(){
                        document.body.removeChild(script);
                        script.onload = null;
                        script = null;
                    },10)
                };
                script.onerror = function(err){
                    defer.reject(err);
                };
                return defer.promise;



            }
    }])
    .config([
    "$injector",
    "$controllerProvider",
    "$compileProvider",
    "$filterProvider",
    "$animateProvider",
    "$provide",
    function($injector, $controllerProvider, $compileProvider, $filterProvider, $animateProvider, $provide){

        var
            ng = angular,
            _module,

            providers,
            decorator
            ;

        _module = ng.module;
        ng.module = module;

        providers = {
            $injector          : $injector,
            $controllerProvider: $controllerProvider,
            $compileProvider   : $compileProvider,
            $filterProvider    : $filterProvider,
            $animateProvider   : $animateProvider,
            $provide           : $provide
        };

        decorator = {
            config    : invokeBridge("$injector", "invoke"),
            controller: invokeBridge("$controllerProvider", "register"),
            directive : invokeBridge("$compileProvider", "directive"),
            filter    : invokeBridge("$filterProvider", "register"),
            animation : invokeBridge("$animateProvider", "register"),

            provider  : invokeBridge("$provide", "provider"),
            decorator : invokeBridge("$provide", "decorator"),
            constant  : invokeBridge("$provide", "constant"),
            value     : invokeBridge("$provide", "value"),
            factory   : invokeBridge("$provide", "factory"),
            service   : invokeBridge("$provide", "service")
        };

        function invokeBridge(provider, method){
            return function(){
                providers[provider][method].apply(ng, arguments);
                return decorator;
            }
        }

        function module(){

            var
                ret = _module.apply(ng, arguments)
                ;

            return ng.extend(ret, decorator);

        }
    }
])
;
/**
 * Created by my on 2016/10/18.
 */
angular
    .module("common.routes", [])
    .constant("ROUTES", [
        {
            url: "/home",
            name: "home",
            tmp: "html/home/main.html",
            ctrl: "homeCtrl",
            ctrlAs: "hc"

        },{

            url: "/food",
            name: "food",
            tmp: "html/food/main.html",
            ctrl: "foodCtrl",
            ctrlAs: "fc"
        }
    ])
    .value("LoadedModules", [])
;