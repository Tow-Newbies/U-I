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