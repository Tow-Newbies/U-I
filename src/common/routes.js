/**
 * Created by my on 2016/10/18.
 */
// 路由定义，可由后台返回
angular
    .module("common.routes", [])
    .constant("ROUTES", [
        {
            url: "/home",
            name: "home",
            tmp: "html/home/main.html",
            ctrl: "homeCtrl",
            ctrlAs: "hc",
            icon: "my-icon-home"

        },{

            url: "/food",
            name: "food",
            tmp: "html/food/main.html",
            ctrl: "foodCtrl",
            ctrlAs: "fc",
            icon: "my-icon-msg"
        },{
            url: "/map",
            name: "map",
            tmp: "html/map/map.html",
            ctrl: "mapCtrl",
            ctrlAs: "mc",
            icon: "my-icon-edit"
        },{
            url: "/walkMate",
            name: "walkMate",
            tmp: "html/walkMate/main.html",
            ctrl: "walkMateCtrl",
            ctrlAs: "wmc",
            icon: "my-icon-edit"
        },{
            url: "/gallary",
            name: "gallary",
            tmp: "html/gallary/main.html",
            ctrl: "gallaryCtrl",
            ctrlAs: "gc",
            icon: "my-icon-edit",
            hideBar:'both'
        }
    ])
    .value("LoadedModules", [])
;