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