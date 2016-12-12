
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
            // This is a test   , you can now check if changed
            // This is a test   , you can now check if changed

            function foo(){
                foo.call(jack);
                this.name = "foo";
                console.log("hahah")
            }
            foo.prototype.say = function() {
                console.log(this.name);
            };

            function jack(){
                this.sing = function(){
                    console.log("This is sing, jack")
                }
            }
        }
    ])
;