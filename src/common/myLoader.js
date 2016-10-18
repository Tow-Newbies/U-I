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