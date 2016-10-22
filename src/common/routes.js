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
        }
    ])
    .value("LoadedModules", [])
;