/**
 * Created by my on 2016/10/18.
 */
angular
    .module("common.myGlobal", [])
    .factory("myGLOBAL", [
        "$window",
        "$location",
        function ($window, $location) {
            var myGLOBAL = {
                modules: ["home"],
                alerts : [],
                userInfo:{
                    pos: null, // 用户当前位置
                    walkMateRoutes: {} // 用户跑步记录
                },
                setting: {
                  hideBar: {
                      both: false,
                      top: false,
                      bot: false
                  }
                },
                open: open
            };

            function open(url, type, errCallback){
                type = !type?0:type;
                if(!url){
                    return errCallback && errCallback.call();
                }
                switch (type){
                    case 0: {
                        $location.path(url);
                        break;
                    }
                    case 1: {
                        break
                    }
                    default: {

                    }
                }
            }
            return myGLOBAL;

        }
    ])
;