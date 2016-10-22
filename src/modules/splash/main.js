/**
 * Created by my on 2016/10/19.
 */
angular
    .module("module.splash", ["ngRoute"])
    .config(["$routeProvider", function($routeProvider){
        $routeProvider
            .when("/splash", {
                templateUrl: "html/splash/splash.html"
            })
    }])
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
