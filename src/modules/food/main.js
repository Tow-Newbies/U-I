
angular
    .module("module.food", [
        "ngRoute"
    ])
    // .config(["$routeProvider", function($routeProvider){
    //     $routeProvider
    //         .when("/food", {
    //             controller: "foodCtrl",
    //             controllerAs: "fc",
    //             templateUrl: "html/food/main.html"
    //         })
    // }])
    .controller("foodCtrl", [
        "$scope",
        function ($scope) {
            var view = this;
            this.msg = "This is food page";

        }
    ])
;