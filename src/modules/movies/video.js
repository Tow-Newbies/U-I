/**
 * Created by my on 2016/10/18.
 */
angular
    .module("module.movies.video", ["ngRoute"])
    .controller("videoCtrl", [
        "$scope",
        function($scope){
            var view = this;

            init();

            function init() {
                view.msg = "This is movies module";
            }

        }
    ])
;